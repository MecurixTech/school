import { serverAuthClient } from "@/lib/auth-server"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User, Search, MessageCircle, Bell } from "lucide-react"
import { logoutAction } from "@/lib/actions"

export async function Navbar() {
  const user = await serverAuthClient.getCurrentUser()

  if (!user) return null

  const initials = user.full_name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  return (
    <nav className="flex items-center justify-between p-4 bg-card border-b border-border">
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-border px-3 py-2 bg-background">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-background rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="bg-background rounded-full w-8 h-8 flex items-center justify-center cursor-pointer relative hover:bg-accent transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
            <span className="text-[8px] text-destructive-foreground font-bold">3</span>
          </div>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-xs leading-3 font-medium text-foreground">{user.full_name}</span>
          <span className="text-[10px] text-muted-foreground capitalize">{user.role}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.profile_image || "/placeholder.svg"} alt={user.full_name} />
                <AvatarFallback className="bg-primary/10 text-primary hover:text-primary-foreground text-sm">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={logoutAction}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full text-left text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
