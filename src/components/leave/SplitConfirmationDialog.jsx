import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SplitConfirmationDialog = ({ proposal, onConfirm, onCancel, isSubmitting }) => {
  if (!proposal) return null;

  return (
    <Dialog open={!!proposal} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Leave Request</DialogTitle>
          <DialogDescription>
            Your leave balance is insufficient for the full request. We can submit it as a split request as detailed below.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-2">
            <h4 className="font-semibold">Proposed Split:</h4>
            <ul className="list-disc list-inside space-y-2 rounded-md border p-4">
                {proposal.split.map((item, index) => (
                    <li key={index} className="flex justify-between items-center">
                        <span>
                            {item.days} day(s) as <Badge variant="secondary">{item.leave_type_name}</Badge>
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {item.start_date} to {item.end_date}
                        </span>
                    </li>
                ))}
            </ul>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Confirming..." : "Confirm and Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SplitConfirmationDialog;