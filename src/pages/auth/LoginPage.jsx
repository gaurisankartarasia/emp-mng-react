import React, { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(identifier, password);
      toast.success('Authentication success')
    } catch (err) {
      setError('Login failed. Please check your credentials.', err);
      toast.error("Authentication failed")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[700px] ">
      <Card className="w-full max-w-md ">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-xl">Authentication</CardTitle>
            <CardDescription className="mb-3" >
              Enter your email, phone or employee id below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4">
              <Label htmlFor="identifier">Email or Phone or Employee ID</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="m@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="mt-4" >
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Spinner color='white' size={20} />}
              <LogIn/>
              Authenticate
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;

