"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { SiteLogo } from "@/components/svg";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";

import googleIcon from "@/public/images/auth/google.png";
import facebook from "@/public/images/auth/facebook.png";
import twitter from "@/public/images/auth/twitter.png";
import GithubIcon from "@/public/images/auth/github.png";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";

const schema = z.object({
  email: z.string().email({ message: "Tu correo no es valido" }),
  password: z.string().min(4),
});
import { useMediaQuery } from "@/hooks/use-media-query";

const LogInForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");

  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "way@gmail.com",
      password: "password",
    },
  });
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const firebaseConfig = {
    apiKey: "AIzaSyDM21AJnL8ewQJL5eBo5tCcbHVBDmEXfZI",
    authDomain: "wayapps-81989.firebaseapp.com",
    projectId: "wayapps-81989",
    storageBucket: "wayapps-81989.firebasestorage.app",
    messagingSenderId: "530130091566",
    appId: "1:530130091566:web:c05efda8ef5f390d8ee9bf",
    measurementId: "G-K007K21KFQ",
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const onSubmit = async (dataLogin: { email: string; password: string }) => {
    console.log("data", dataLogin);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      dataLogin.email,
      dataLogin.password
    );
    const user = userCredential.user;
    const idToken = await user.getIdToken();
    console.log("✅ Token de Firebase:", idToken);

    const dataFetch = {
      idToken: idToken,
      pnToken:
        "eJGnH1i5T3SCNmheTLiW7R:APA91bEb7h_bY2z1TEvUQYJYi9hbgA86j_P5jUvt-lJN7zX7rhmQqaOOf_qyusqkMXeEPKQRq7JDvFH56hiwo1o2WT9ssxHdKjlF1sq2u-b5NrnlKf0k20GVaYYwMpPQvDFCE8a-iL-Z",
      mobile: "999999999",
      email: "way@gmail.com",
      firstName: "Way",
      lastName: "Way",
      role: "passenger",
      authType: "mobile",
    };

    fetch(`http://${process.env.NEXT_PUBLIC_SITE_URL}/api/1.0/auth/login`, {
      method: "POST", // Método POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFetch),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Éxito:", data.data.accessToken);
        localStorage.setItem("accessToken", data.data.accessToken);
        startTransition(async () => {
          let response = await signIn("credentials", {
            email: dataLogin.email,
            password: dataLogin.password,
            redirect: false,
          });
          if (response?.ok) {
            toast.success("Inicio de sesión exitoso");
            window.location.assign("/dashboard");
            reset();
          } else if (response?.error) {
            toast.error(response?.error);
          }
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div className="w-full py-10">
      {/* <Link href="#" className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
      </Link> */}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
        <div>
          <Label htmlFor="email" className="mb-2 font-medium text-default-600">
            Email{" "}
          </Label>
          <Input
            disabled={isPending}
            {...register("email")}
            type="email"
            id="email"
            className={cn("", {
              "border-destructive": errors.email,
            })}
            size={!isDesktop2xl ? "xl" : "lg"}
          />
        </div>
        {errors.email && (
          <div className=" text-destructive mt-2">{errors.email.message}</div>
        )}

        <div className="mt-3.5">
          <Label
            htmlFor="password"
            className="mb-2 font-medium text-default-600"
          >
            Password{" "}
          </Label>
          <div className="relative">
            <Input
              disabled={isPending}
              {...register("password")}
              type={passwordType}
              id="password"
              className="peer "
              size={!isDesktop2xl ? "xl" : "lg"}
              placeholder=" "
            />

            <div
              className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
              onClick={togglePasswordType}
            >
              {passwordType === "password" ? (
                <Icon
                  icon="heroicons:eye"
                  className="w-5 h-5 text-default-400"
                />
              ) : (
                <Icon
                  icon="heroicons:eye-slash"
                  className="w-5 h-5 text-default-400"
                />
              )}
            </div>
          </div>
        </div>
        {errors.password && (
          <div className=" text-destructive mt-2">
            {errors.password.message}
          </div>
        )}

        <div className="mt-5  mb-8 flex flex-wrap gap-2">
          <div className="flex-1 flex  items-center gap-1.5 ">
            <Checkbox
              size="sm"
              className="border-default-300 mt-[1px]"
              id="isRemebered"
            />
            <Label
              htmlFor="isRemebered"
              className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
            >
              Recuerdame
            </Label>
          </div>
        </div>
        <Button
          className="w-full"
          disabled={isPending}
          size={!isDesktop2xl ? "lg" : "md"}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Cargando..." : "Ingresar"}
        </Button>
      </form>
      <div className="mt-6 xl:mt-8 flex flex-wrap justify-center gap-4">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full  border-default-300 hover:bg-transparent"
          disabled={isPending}
          onClick={() =>
            signIn("google", {
              callbackUrl: "/dashboard",
            })
          }
        >
          <Image
            src={googleIcon}
            alt="google"
            className="w-5 h-5"
            priority={true}
          />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full border-default-300 hover:bg-transparent"
        >
          <Image
            src={facebook}
            alt="google"
            className="w-5 h-5"
            priority={true}
          />
        </Button>
      </div>
    </div>
  );
};

export default LogInForm;
