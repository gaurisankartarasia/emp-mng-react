import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const LeaveBalanceCard = ({ annualBalance, balanceDetails }) => {
  if (!annualBalance || !balanceDetails) {
    return <p>Loading leave balance...</p>;
  }

  const getBadgeVariant = (remaining) => {
    if (remaining === null || remaining > 5) return "success";
    if (remaining > 0) return "warning";
    return "destructive";
  };

  const paidLeaveDetails = balanceDetails.filter(detail => !detail.is_unpaid && detail.allowance > 0);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Annual Leave Summary</CardTitle>
        <CardDescription>
          You have used {annualBalance.taken} of your {annualBalance.allowance} total paid leave days this year.
        </CardDescription>
        <Progress value={(annualBalance.taken / annualBalance.allowance) * 100} className="mt-2" />
      </CardHeader>
      <CardContent>
        <h4 className="mb-4 text-sm font-medium">Balance by Leave Type:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paidLeaveDetails.map((detail) => (
            <div key={detail.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{detail.name}</span>
                <Badge variant={getBadgeVariant(detail.remaining)}>
                  {detail.remaining} Days Left
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {detail.taken} of {detail.allowance} days taken
              </p>
               
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceCard;
