import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import {
  Plus,
  Lightbulb,
  Clock,
  CheckCircle
} from 'lucide-react';
import { inspirationData, wipData, completedData } from '~/mock/dashboardData';

export function WorkspacePage() {
  return (
    <>
      {/* Inspiration List Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <h2 className="text-base font-medium">灵感列表</h2>
          </div>
          <Button variant="outline" size="sm" className="h-7 px-2">
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {inspirationData.map((category, idx) => {
            console.log('inspiration category:', category);
            return (
              <Card
                key={idx}
                className="border-gray-200 dark:border-gray-700 shadow-none lg:w-[300px] w-[260px] "
              >
                <CardHeader className="pb-2 pt-3 px-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm">{category.category}</span>
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4 rounded">
                        {category.count}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5 p-3 pt-0">
                  {category.items.map((item, itemIdx) => {
                    console.log('inspiration item:', item);
                    return (
                      <div key={itemIdx} className="p-2 rounded hover:bg-accent/50 transition-colors">
                        <div className="font-medium text-xs leading-tight mb-1.5 break-words">
                          {item.title}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <Badge className={`text-xs px-1.5 py-0.5 h-4 rounded ${category.tag.color}`}>
                            {category.tag.label}
                          </Badge>
                          <span className="text-muted-foreground">{item.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* WIP Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <h2 className="text-base font-medium">WIP</h2>
          </div>
          <Button variant="outline" size="sm" className="h-7 px-2">
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {wipData.map((category, idx) => {
            console.log('wip category:', category);
            return (
              <Card
                key={idx}
                className="border-gray-200 dark:border-gray-700 shadow-none lg:w-[300px] w-[260px] "
              >
                <CardHeader className="pb-2 pt-3 px-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm">{category.category}</span>
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4 rounded">
                        {category.count}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5 p-3 pt-0">
                  {category.items.map((item, itemIdx) => {
                    console.log('wip item:', item);
                    return (
                      <div key={itemIdx} className="p-2 rounded-lg border">
                        <h4 className="font-medium text-xs leading-tight mb-2">{item.title}</h4>
                        <div className="space-y-1.5">
                          <Progress value={item.progress} className="h-1.5" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{item.progress}%</span>
                            <span>{item.deadline}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Completed Today Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <h2 className="text-base font-medium">今日完成</h2>
          </div>
          <Button variant="outline" size="sm" className="h-7 px-2">
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {completedData.map((category, idx) => {
            console.log('completed category:', category);
            return (
              <Card
                key={idx}
                className="border-gray-200 dark:border-gray-700 shadow-none lg:w-[300px] w-[260px] "
              >
                <CardHeader className="pb-2 pt-3 px-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm">{category.category}</span>
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4 rounded">
                        {category.count}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5 p-3 pt-0">
                  {category.items.map((item, itemIdx) => {
                    console.log('completed item:', item);
                    return (
                      <div
                        key={itemIdx}
                        className="p-2 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <h4 className="font-medium text-xs leading-tight mb-1.5">{item.title}</h4>
                        <div className="flex items-center justify-between text-xs">
                          <Badge className={`text-xs px-1.5 py-0.5 h-4 rounded ${category.tag.color}`}>
                            {category.tag.label}
                          </Badge>
                          <span className="text-muted-foreground">{item.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
