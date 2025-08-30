import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Users, Gift } from 'lucide-react';

interface RewardsTrackerProps {
  earnings: number;
}

export function RewardsTracker({ earnings }: RewardsTrackerProps) {
  return (
    <div className="flex items-center space-x-4">
      {/* Current Earnings */}
      <Badge className="bg-accent hover:bg-accent-hover text-accent-foreground">
        <Coins className="w-4 h-4 mr-2" />
        ₹{earnings}
      </Badge>

      {/* Stats Dropdown/Expandable */}
      <Card className="hidden md:block bg-primary-foreground/10 border-primary-foreground/20">
        <CardContent className="p-3">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-primary-foreground/80" />
              <div>
                <p className="text-xs text-primary-foreground/80">This Month</p>
                <p className="text-sm font-semibold text-primary-foreground">₹{earnings}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-primary-foreground/80" />
              <div>
                <p className="text-xs text-primary-foreground/80">Referrals</p>
                <p className="text-sm font-semibold text-primary-foreground">0</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-primary-foreground/80" />
              <div>
                <p className="text-xs text-primary-foreground/80">Videos</p>
                <p className="text-sm font-semibold text-primary-foreground">{earnings > 0 ? 1 : 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}