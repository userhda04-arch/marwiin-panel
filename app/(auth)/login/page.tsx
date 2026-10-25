"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { signIn } from "next-auth/react"

const Login = () => {
    const DiscordLogIn = async () => {
        signIn('discord', {
            redirect: true,
            callbackUrl: "/dashboard"
        })
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background/95 relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div 
                className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 0.5 }}
                transition={{ duration: 1 }}
            />
            <motion.div 
                className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl right-0"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 0.5 }}
                transition={{ duration: 1, delay: 0.2 }}
            />

            {/* Logo and branding */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold text-primary mb-2">MarWiin</h1>
                <p className="text-muted-foreground">Cloud Management Panel</p>
            </motion.div>

            {/* Login card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="w-[350px] md:w-[400px] border-2 border-border/50 shadow-xl backdrop-blur-sm bg-background/95">
                    <CardHeader className="space-y-3">
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription className="text-base">
                            Access your MarWiin dashboard to manage licenses and server configurations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-4">
                        <div className="w-full max-w-xs border border-border/50 rounded-lg p-4 text-center bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-2">Secure Authentication</p>
                            <p className="text-xs">Using Discord's OAuth2 system</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button 
                            onClick={DiscordLogIn} 
                            className="w-full py-6 text-base transition-all hover:scale-[1.02]"
                            size="lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-discord mr-2" viewBox="0 0 16 16">
                                <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                            </svg>
                            Continue with Discord
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            By continuing, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}

export default Login
