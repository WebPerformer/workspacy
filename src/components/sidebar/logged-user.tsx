// React and Next.js hooks
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Third-party icons
import {
  Eye,
  EyeOff,
  ShieldEllipsis,
  LogOut,
  Pencil,
  SquareUserRound,
  Trash,
  User,
} from "lucide-react";

// UI components and forms
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useSidebar } from "@/src/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

// App context and logic
import { AuthContext } from "@/src/contexts/AuthContext";
import {
  ChangeUsernameProfile,
  ChangePasswordProfile,
  DeleteProfile,
} from "@/src/lib/user";
import { SignOutRequest } from "@/src/lib/auth";

// Third-party libraries
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Images and assets
import loading from "@/public/images/loading.svg";
import Link from "next/link";

const formSchemaUsername = z.object({
  username: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(30, {
      message: "Name must be less than 30 characters.",
    }),
});

const formSchemaPassword = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

function LoggedUser() {
  const { isMobile, toggleSidebar } = useSidebar();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeDialog, setActiveDialog] = useState<
    "username" | "password" | "delete" | null
  >(null);

  const formUsername = useForm<z.infer<typeof formSchemaUsername>>({
    resolver: zodResolver(formSchemaUsername),
    defaultValues: {
      username: "",
    },
  });

  const formPassword = useForm<z.infer<typeof formSchemaPassword>>({
    resolver: zodResolver(formSchemaPassword),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { user, setUser } = useContext(AuthContext);

  async function onSubmitUsername(values: z.infer<typeof formSchemaUsername>) {
    setIsLoading(true);
    const { success, data } = await ChangeUsernameProfile(values);

    if (success) {
      toast.success(data.message);
      if (user) {
        setUser({
          ...user,
          username: values.username,
        });
      }
    } else {
      toast.error(data.message);
    }
    setIsLoading(false);
    setOpen(false);
  }

  async function onSubmitPassword(values: z.infer<typeof formSchemaPassword>) {
    setIsLoading(true);
    const { success, data } = await ChangePasswordProfile(values);

    if (success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
    setIsLoading(false);
    setOpen(false);
  }

  const handleLogout = async () => {
    await SignOutRequest();
    setUser(null);
    router.push("/");
  };

  const handleDeleteProfile = async () => {
    await DeleteProfile();
    setUser(null);
    router.push("/");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu modal={isMobile ? true : false}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 hover:bg-secondary/40 p-1 rounded-lg cursor-pointer">
            {user?.profileImage ? (
              <Image
                src={
                  user.profileImage.startsWith("http")
                    ? user.profileImage
                    : `/images/avatars/${user.profileImage}.svg`
                }
                alt="profile"
                width={36}
                height={36}
                className="rounded-lg"
              />
            ) : (
              <div className="w-9 h-9 flex items-center justify-center text-muted-foreground bg-popover rounded-lg p-2">
                <User size={16} />
              </div>
            )}
            <div className="max-w-[160px]">
              <p className="text-base font-medium truncate break-all">
                {user?.username}
              </p>
              <p className="text-xs text-muted-foreground truncate break-all">
                {user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {user?.profileImage ? (
                  <Image
                    src={
                      user.profileImage.startsWith("http")
                        ? user.profileImage
                        : `/images/avatars/${user.profileImage}.svg`
                    }
                    alt="profile"
                    width={36}
                    height={36}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="w-9 h-9 flex items-center justify-center text-muted-foreground bg-popover rounded-lg p-2">
                    <User size={16} />
                  </div>
                )}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate">{user?.username}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link
                href="/avatar-picker"
                onClick={() => isMobile && toggleSidebar()}
              >
                <DropdownMenuItem>
                  <SquareUserRound />
                  Select avatar
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DialogTrigger asChild>
                <DropdownMenuItem onClick={() => setActiveDialog("username")}>
                  <Pencil />
                  Change name
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild>
                <DropdownMenuItem onClick={() => setActiveDialog("password")}>
                  <ShieldEllipsis />
                  Reset password
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild>
                <DropdownMenuItem onClick={() => setActiveDialog("delete")}>
                  <Trash />
                  Delete Account
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      {activeDialog === "username" && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Username</DialogTitle>
            <DialogDescription>Update your username here.</DialogDescription>
          </DialogHeader>
          <Form {...formUsername}>
            <form
              onSubmit={formUsername.handleSubmit(onSubmitUsername)}
              className="space-y-6"
            >
              <FormField
                control={formUsername.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Image src={loading} alt="loading" width={20} height={20} />
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      )}
      {activeDialog === "password" && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Update your password here.</DialogDescription>
          </DialogHeader>
          <Form {...formPassword}>
            <form
              onSubmit={formPassword.handleSubmit(onSubmitPassword)}
              className="space-y-6"
            >
              <div className="flex flex-col gap-4">
                <FormField
                  control={formPassword.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="pr-12"
                          />
                          <div
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                          >
                            {showPassword ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formPassword.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                            className="pr-12"
                          />
                          <div
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                          >
                            {showConfirmPassword ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Image src={loading} alt="loading" width={20} height={20} />
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      )}
      {activeDialog === "delete" && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and all of its data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteProfile}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default LoggedUser;
