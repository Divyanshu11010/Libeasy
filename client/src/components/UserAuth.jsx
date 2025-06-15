import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function UserAuth() {
  const [mode, setMode] = useState("login");

  return (
    <Card className="w-full dark max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center gap-4 mb-4">
          <Button
            variant={mode === "login" ? "default" : "ghost"}
            onClick={() => setMode("login")}
          >
            Login
          </Button>
          <Button
            variant={mode === "signup" ? "default" : "ghost"}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {mode === "login" ? (
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        ) : (
          <form>
            <div className="flex flex-col gap-6">
              {/* Username */}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="Your full name" required />
              </div>

              {/* Email + Get OTP */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Input id="email" type="email" placeholder="m@example.com" required className="flex-1" />
                  <Button type="button" variant="outline">
                    Get OTP
                  </Button>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="grid gap-2">
                <Label htmlFor="contact">Mobile Number</Label>
                <Input id="contact" type="tel" placeholder="+91XXXXXXXXXX" required />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>

              {/* OTP */}
              <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <Input id="otp" type="text" placeholder="Enter the OTP" required />
              </div>
            </div>
          </form>

        )}
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          {mode === "login" ? "Login" : "Sign Up"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default UserAuth;