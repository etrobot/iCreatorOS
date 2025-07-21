import { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Tips } from './Tips';
import { EyeIcon, EyeOff, Files, Expand, Shrink } from 'lucide-react';
import { Button } from './ui/button';
import { PromptForm } from './PromptForm';
import { Artifact } from './Artifact';
import { ArtifactProps } from '../types';
import { ModeToggle } from './mode-toggle';

// 定义Chat组件的属性类型
interface ChatProps {
  initialMessages?: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
  }>;
  previewContent?: ArtifactProps;
}

export function Chat({ initialMessages = [], previewContent: initialPreviewContent }: ChatProps) {
    const [input, setInput] = useState('');
    const [error, setError] = useState<Error | null>(null);
    const [previewContent, setPreviewContent] = useState<ArtifactProps>(initialPreviewContent || { content: '', language: 'markdown' });
    const [previewOpen, setPreviewOpen] = useState(true);
    const [copied, setCopied] = useState(false);
    const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());
    const [chatVisible, setChatVisible] = useState(true);
    const [showPrompts, setShowPrompts] = useState(false);

    // 使用 useChat hook，并传入 initialMessages
    const { data, append, messages, status } = useChat({
        api: '/api/chat',
        initialMessages,
        body: {
            llmConfig: JSON.parse(localStorage.getItem('llmConfig') || '{}')
        },
        onError: (err) => {
            console.error("聊天请求出错:", err);
            if (err instanceof Error) {
                console.error("错误详情:", {
                    message: err.message,
                    stack: err.stack,
                    name: err.name
                });
            } else {
                console.error("非标准错误对象:", err);
            }
            setError(err instanceof Error ? err : new Error(String(err)));
        },
        onFinish: (message) => {
            console.log("聊天响应完成，包含思考过程:", {
                message,
                data,
                reasoning: message.reasoning
            });
            setPreviewContent({ content: message.content, language: 'markdown' });
        }
    });

    const sendMessage = async (message: string) => {
        if (!message.trim()) return;

        console.log("准备发送消息:", message);
        setError(null);

        try {
            await append({
                role: 'user',
                content: message
            });
                        
            console.log("消息发送成功");
        } catch (err) {
            console.error("发送消息时出错:", err);
            console.error("错误详细信息:", {
                error: err,
                errorType: typeof err,
                errorString: String(err)
            });

            const errorMessage = err instanceof Error
                ? `${err.message}\n${err.stack}`
                : String(err);
            setError(new Error(`发送消息失败: ${errorMessage}`));
        }
    };

    // 处理表单提交
    const handleSubmit = async (value: string) => {
        console.log("准备发送消息:", value);
        if (value.trim() && status !== 'streaming' && status !== 'submitted') {
            try {
                await sendMessage(value);
            } catch (err) {
                console.error("处理提交时出错:", err);
            }
        }
    };

    // 判断是否正在加载
    const isLoading = status === 'streaming' || status === 'submitted';

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        console.log("Header heights updated:", {
            previewHeader: document.querySelector('.preview-header')?.clientHeight,
            chatHeader: document.querySelector('header')?.clientHeight
        });
    }, [previewOpen]);

    // 处理快捷提示词选择
    const handlePromptSelect = (promptContent: string) => {
        console.log("选择提示词:", promptContent);
        setInput(promptContent);
        setShowPrompts(false);
    };

    return (
        <div className="flex h-screen bg-background">
            {/* 左侧预览面板 */}
            {previewOpen && (
                <div className={`${chatVisible ? 'w-3/5' : 'w-full'} border-r border flex flex-col transition-all duration-300 ease-in-out`}>
                    <div className="flex items-center justify-between p-1 border-b border">
                        <div className="flex items-center gap-2 mx-4 font-bold">
                            <span>Markdown Renderer</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant='outline'
                                onClick={() => copyToClipboard(previewContent.content)}
                                title="复制"
                            >
                                <Files className={`h-5 w-5 ${copied ? "text-green-500" : ""}`} />
                            </Button>
                            <Button
                                variant='outline'
                                onClick={() => setChatVisible(!chatVisible)}
                                title={chatVisible ? "最大化预览" : "恢复布局"}
                            >
                                {chatVisible ? (
                                    <Expand className="h-5 w-5" />
                                ) : (
                                    <Shrink className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto px-4 py-1">
                        <Artifact language={previewContent.language} content={previewContent.content} />
                    </div>
                </div>
            )}

            {/* 右侧聊天区域 */}
            {chatVisible && (
                <div
                    className=
                        "flex flex-col flex-1 transition-all duration-200 ease-in-out">
                    {/* 头部 */}
                    <header className="flex items-center justify-between p-1 border-b border">
                        <div>
                            {
                                <Button
                                    variant='outline'
                                    onClick={() => setPreviewOpen(!previewOpen)}
                                    title={previewOpen ? "隐藏预览" : "显示预览"}
                                >
                                    {previewOpen ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </Button>
                            }
                        </div>
                        <ModeToggle />
                    </header>

                    {/* 消息区域 */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="max-w-3xl mx-auto space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 my-8">
                                    开始一个新的对话吧！
                                </div>
                            )}

                            {messages.map((message, i) => (
                                <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`rounded-lg overflow-x-auto  w-4/5 ${
                                        message.role === 'user'
                                            ? 'bg-gray-400 text-white p-2'
                                            : ''
                                    }`}>
                                        <div className="mb-1 text-xs">
                                            {message.role === 'user' ? '你' : 'AI助手'}
                                        </div>
                                        
                                        {message.role === 'assistant' && (message.reasoning || (data && data.length > 0)) && (
                                            <div className="text-sm text-slate-400">
                                                <div 
                                                    className="flex items-center cursor-pointer rounded"
                                                    onClick={() => {
                                                        setExpandedMessages(prev => {
                                                            const newSet = new Set(prev);
                                                            if (newSet.has(i)) {
                                                                newSet.delete(i);
                                                            } else {
                                                                newSet.add(i);
                                                            }
                                                            return newSet;
                                                        });
                                                    }}
                                                >
                                                    <span className="mr-2">
                                                        {expandedMessages.has(i) ? '▼' : '▶'}
                                                    </span>
                                                    <span className="font-medium">思考过程</span>
                                                </div>
                                                
                                                {expandedMessages.has(i) && (
                                                    <div className="ml-1 p-2 border-l border-gray-300">
                                                        {data && data.length > 0 && (
                                                            <div className="mb-2">
                                                                {data.map((item, index) => (
                                                                    <div key={index} className="mb-1">
                                                                        {item?.toString()}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {message.reasoning}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        <Tips content={message.content} setPreviewContent={setPreviewContent}/>
                                    </div>
                                </div>
                            ))}

                            {error && (
                                <div className="flex justify-center">
                                    <div className="rounded-lg  bg-red-500 text-white">
                                        错误: {error.message}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 输入区域 */}
                    <div>
                        <PromptForm
                            input={input}
                            setInput={setInput}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
