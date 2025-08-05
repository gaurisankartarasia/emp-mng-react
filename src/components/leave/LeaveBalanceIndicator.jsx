import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useT } from "@/hooks/useT";

const LeaveBalanceIndicator = ({
  balanceDetails,
  unpaidLeaveBalance,
  annualBalance,
}) => {

   const t = useT()

  if (!balanceDetails || !unpaidLeaveBalance || !annualBalance) {
    return <Spinner />;
  }

  const relevantLeaveTypes = balanceDetails.filter(
    (detail) => detail.monthly_allowance !== null || detail.is_unpaid,
  );

 

  return (
    <Card className="mt-4">
      <CardContent className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Section 1: Per-Type Balances */}{" "}
        <div className="flex-1">
          <h3 className="text-sm font-semibold  text-center text-muted-foreground mb-2">
            {t('monthly-leaves-remaining')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {relevantLeaveTypes.map((balance) => (
              <div key={balance.id} className="text-center">
                <p className="text-md font-semibold text-muted-foreground">
                  {balance.name}
                </p>
                <p className=" text-md">
                  {t('taken')} : {balance.monthly_allowance ?? "N/A"}
                </p>
                <p className=" text-md">
                  {t('remaining')} {" "}
                  {balance?.monthly_allowance != null && balance?.taken != null
                    ? balance.monthly_allowance - balance.taken
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Separator orientation="vertical" className="h-auto hidden lg:block" />
        <Separator orientation="horizontal" className="lg:hidden" />
        {/* Section 2: Unpaid Leave Tracker */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-center text-muted-foreground mb-2">
            {/* Unpaid Leave Taken */}
            {t('unpaid-leave-taken')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="font-bold text-xl text-amber-600">
                {unpaidLeaveBalance.takenThisMonth}
              </p>
              <p className="text-md text-muted-foreground">  {t('this-month')} </p>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl">
                {unpaidLeaveBalance.takenThisYear}
              </p>
              <p className="text-md text-muted-foreground">   {t('this-year')}  </p>
            </div>
          </div>
        </div>
        <Separator orientation="vertical" className="h-auto hidden lg:block" />
        <Separator orientation="horizontal" className="lg:hidden" />
        {/* Section 3: Total Paid Annual Cap */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            {t('total-paid-leave-annual')}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="font-bold text-xl">{annualBalance.allowance}</p>
              <p className="text-md text-muted-foreground">  {t('limit')}  </p>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl text-red-600">
                {annualBalance.taken}
              </p>
              <p className="text-md text-muted-foreground">  {t('used')} </p>
            </div>
            <div className="text-center">
              <p className="font-bold text-xl text-green-600">
                {annualBalance.remaining}
              </p>
              <p className="text-md text-muted-foreground">{t('remaining')} </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceIndicator;
