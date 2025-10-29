"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import { Footer } from "../../../components/Footer";
import { ArrowLeft } from "lucide-react";
import type { User, UserRole } from "@/types/user";
import uitLogo from "./../../../public/UITLogo.jpg";
import { useRouter } from "next/navigation";

interface LoginPageProps {
  onLogin: (user: User) => void;
  onBackToShowroom?: () => void;
}

export default function RegisterPage({
  onLogin,
  onBackToShowroom,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate credentials and determine role automatically
    let user: User | null = null;

    if (user) {
      onLogin(user);
    } else {
      alert(
        "Invalid credentials. Please check your username/student number and password."
      );
    }
  };
  const handleBackToShowroom = () => {
    router.push("/");
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-green-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <Button
          variant="outline"
          onClick={handleBackToShowroom}
          className="absolute top-4 left-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collection
        </Button>

        <Card className="w-full max-w-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Image
                src={uitLogo}
                alt="University of Infomation Techonology"
                className="h-40 w-80 object-contain"
              />
            </div>
            <CardTitle className="text-2xl">
              {"Library Management System"}
            </CardTitle>
            <CardDescription>
              "Register to access your account and explore our collection."
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginField">Full Name</Label>
                <Input
                  id="loginField"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginField">Email</Label>
                <Input
                  id="loginField"
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>

            <div className="mt-4 text-center">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={() => handleBackToLogin()}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
