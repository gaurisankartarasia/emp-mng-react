import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"
import { Link } from "react-router-dom"

export default function AccessDenied() {
  return (
    <div className="flex items-center justify-center ">
      <Alert className="max-w-md border-none bg-background "  >
        <ShieldAlert className="h-5 w-5 text-destructive" />
        <AlertTitle className="text-destructive">Access Denied</AlertTitle>
        <AlertDescription>
          You do not have sufficient permissions. Please contact your administrator.
          <Link to="/"  className="text-primary hover:underline" >Return home</Link>
        </AlertDescription>
      </Alert>
      
    </div>
  )
}
