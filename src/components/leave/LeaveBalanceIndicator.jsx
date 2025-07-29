
import { Card } from "@/components/ui/card";

const LeaveBalanceIndicator = ({ balanceDetails, unpaidLeaveBalance, annualBalance }) => {
  if (!balanceDetails || !unpaidLeaveBalance) return null;

  const paidLeaveBalances = balanceDetails.filter(
    (detail) => !detail.is_unpaid && detail.allowance !== null && detail.allowance > 0
  );

  return (
    <Card className="p-2 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold pl-2 whitespace-nowrap">Remaining leaves:</h3>
            <div className="flex space-x-3">
            {paidLeaveBalances.map((balance) => (
                <div key={balance.id} className="text-center p-2 rounded-lg">
                    <p className=" text-lg ">{balance.remaining}</p>
                    <p className="text-xs text-muted-foreground">{balance.name}</p>
                </div>
            ))}
            </div>
        </div>
        
        <div className="text-center p-2 rounded-lg mr-2">
            <p className=" text-lg ">{unpaidLeaveBalance.takenThisMonth}</p>
            <p className="text-xs text-muted-foreground">Unpaid This Month</p>
        </div>

         <div className="text-center p-2 rounded-lg mr-2">
            <p className=" text-sm ">Annual total leave days: {annualBalance.allowance}</p>
            <p className=" text-sm ">taken: {annualBalance.taken}</p>
            <p className=" text-sm ">Remaining: {annualBalance.remaining}</p>
        </div>
      </div>
    </Card>
  );
};

export default LeaveBalanceIndicator;


