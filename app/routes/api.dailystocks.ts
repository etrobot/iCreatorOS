import { getTopics } from '../utils/gubatopics';


export async function action({ request }: { request: Request }) {
  try {
    const topics = await getTopics();
    // console.log("获取到的热门话题:", topics);
    
    // 直接返回话题数据，不再处理聊天消息
    return new Response(
      JSON.stringify({ 
        topics: topics,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("API处理出错:", error);
    return new Response(
      JSON.stringify({
        error: "处理请求时出错",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}