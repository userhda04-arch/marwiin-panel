"use client"

import React, { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface OptionType {
    value: string
    label: string
}

interface MultiSelectProps {
    options: OptionType[];
    selected: string[];
    onChange: React.Dispatch<React.SetStateAction<string[]>>;
    className?: string;
}

export function MultiSelect({ 
    options = [], 
    selected = [], 
    onChange,
    className 
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [dropdownRef])

    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter(item => item !== value))
        } else {
            onChange([...selected, value])
        }
    }

    const removeOption = (e: React.MouseEvent, value: string) => {
        e.stopPropagation()
        onChange(selected.filter(item => item !== value))
    }

    return (
        <div className={cn("relative w-full", className)} ref={dropdownRef}>
            <div 
                className={cn(
                    "w-full min-h-9 px-3 py-2 flex flex-wrap gap-1 border rounded-md cursor-pointer",
                    isOpen ? "border-primary ring-1 ring-primary" : "border-input"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selected.length === 0 && (
                    <span className="text-muted-foreground">Select options...</span>
                )}
                
                {selected.map((value) => {
                    const option = options.find(opt => opt.value === value)
                    return (
                        <Badge key={value} variant="secondary" className="mr-1 mb-1">
                            {option?.label || value}
                            <button
                                className="ml-1 rounded-full outline-none"
                                onClick={(e) => removeOption(e, value)}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )
                })}
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 border rounded-md bg-background shadow-md max-h-[200px] overflow-y-auto">
                    {options.length === 0 && (
                        <div className="p-2 text-sm text-muted-foreground">No options available</div>
                    )}
                    
                    {options.map((option) => {
                        const isSelected = selected.includes(option.value)
                        return (
                            <div
                                key={option.value}
                                className={cn(
                                    "px-3 py-2 text-sm cursor-pointer flex items-center gap-2",
                                    isSelected ? "bg-primary/10" : "hover:bg-muted"
                                )}
                                onClick={() => toggleOption(option.value)}
                            >
                                <div 
                                    className={cn(
                                        "w-4 h-4 border rounded-sm flex items-center justify-center",
                                        isSelected ? "bg-primary border-primary" : "border-primary/50"
                                    )}
                                >
                                    {isSelected && <span className="text-xs text-primary-foreground">✓</span>}
                                </div>
                                <span>{option.label}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
