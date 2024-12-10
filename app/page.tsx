import { DashboardHeader } from '@/components/dashboard/header';
import { SubscriptionList } from '@/components/subscriptions/list';
import { SubscriptionCalendar } from '@/components/subscriptions/calendar';
import { RemovalList } from '@/components/subscriptions/removal-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'Dashboard',
  description: 'Manage your subscriptions efficiently',
};

export const dynamic = 'force-static';

export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-8">
        <DashboardHeader />
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
            <SubscriptionList />
            <RemovalList />
          </TabsContent>
          <TabsContent value="calendar" className="mt-6">
            <SubscriptionCalendar />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
