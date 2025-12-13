import { User } from "lucide-react"

interface DefaultAvatarProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function DefaultAvatar({ size = "md", className = "" }: DefaultAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-24 w-24",
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 48,
  }

  return (
    <div
      className={`${sizeClasses[size]} ${className} rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-600 p-[2px]`}
    >
      <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
        <User size={iconSizes[size]} className="text-gray-400" strokeWidth={1.5} />
      </div>
    </div>
  )
}
