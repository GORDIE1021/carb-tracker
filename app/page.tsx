"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Calendar, Target, TrendingUp, Save, Zap, Database, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Default food database with carb content per serving
const DEFAULT_FOOD_DATABASE = {
  // Original foods
  egg: 1,
  toast: 15,
  banana: 27,
  apple: 25,
  "cottage cheese": 5,
  salami: 1,
  olives: 0.2,
  milk: 12,
  chili: 15,
  donut: 22,
  pizza: 30,
  "liver dinner": 17,
  cheese: 1,
  soup: 15,
  "pork rinds": 1,
  "egg salad": 5,
  "possum pie": 156,

  // Additional common foods
  rice: 45,
  pasta: 43,
  bread: 12,
  potato: 37,
  "sweet potato": 27,
  oatmeal: 27,
  cereal: 24,
  yogurt: 17,
  orange: 15,
  grapes: 16,
  strawberries: 8,
  blueberries: 14,
  "chicken breast": 0,
  salmon: 0,
  tuna: 0,
  beef: 0,
  pork: 0,
  broccoli: 6,
  spinach: 1,
  carrots: 10,
  "green beans": 7,
  corn: 19,
  peas: 14,
  beans: 20,
  lentils: 20,
  quinoa: 39,
  nuts: 6,
  "peanut butter": 8,
  avocado: 4,
  crackers: 18,
  chips: 15,
  chocolate: 25,
  "ice cream": 22,
  cake: 35,
  cookies: 20,
  lettuce: 2,
  tomato: 4,
  cucumber: 2,
  "olive oil": 0,
  butter: 0,
  "cream cheese": 2,
}

// Meal Templates
const MEAL_TEMPLATES = {
  breakfast: [
    {
      name: "🥣 Cereal & Milk",
      items: [
        { qty: "1", item: "cereal", carbs: 24 },
        { qty: "1", item: "milk", carbs: 12 },
      ],
      totalCarbs: 36,
    },
    {
      name: "🍞 Toast & Banana",
      items: [
        { qty: "2", item: "toast", carbs: 30 },
        { qty: "1", item: "banana", carbs: 27 },
      ],
      totalCarbs: 57,
    },
    {
      name: "🥞 Oatmeal & Berries",
      items: [
        { qty: "1", item: "oatmeal", carbs: 27 },
        { qty: "1", item: "blueberries", carbs: 14 },
      ],
      totalCarbs: 41,
    },
    {
      name: "🍳 Eggs & Toast",
      items: [
        { qty: "2", item: "egg", carbs: 2 },
        { qty: "1", item: "toast", carbs: 15 },
      ],
      totalCarbs: 17,
    },
    {
      name: "🥛 Yogurt & Fruit",
      items: [
        { qty: "1", item: "yogurt", carbs: 17 },
        { qty: "1", item: "strawberries", carbs: 8 },
      ],
      totalCarbs: 25,
    },
  ],
  lunch: [
    {
      name: "🍕 Pizza Slice",
      items: [
        { qty: "2", item: "pizza", carbs: 60 },
        { qty: "1", item: "milk", carbs: 12 },
      ],
      totalCarbs: 72,
    },
    {
      name: "🥗 Chicken Salad",
      items: [
        { qty: "1", item: "chicken breast", carbs: 0 },
        { qty: "1", item: "lettuce", carbs: 2 },
        { qty: "1", item: "tomato", carbs: 4 },
        { qty: "1", item: "crackers", carbs: 18 },
      ],
      totalCarbs: 24,
    },
    {
      name: "🍝 Pasta Bowl",
      items: [
        { qty: "1", item: "pasta", carbs: 43 },
        { qty: "1", item: "cheese", carbs: 1 },
      ],
      totalCarbs: 44,
    },
    {
      name: "🍲 Soup & Bread",
      items: [
        { qty: "1", item: "soup", carbs: 15 },
        { qty: "1", item: "bread", carbs: 12 },
      ],
      totalCarbs: 27,
    },
    {
      name: "🥪 Tuna Sandwich",
      items: [
        { qty: "2", item: "bread", carbs: 24 },
        { qty: "1", item: "tuna", carbs: 0 },
      ],
      totalCarbs: 24,
    },
  ],
  dinner: [
    {
      name: "🍚 Rice & Chicken",
      items: [
        { qty: "1", item: "rice", carbs: 45 },
        { qty: "1", item: "chicken breast", carbs: 0 },
        { qty: "1", item: "broccoli", carbs: 6 },
      ],
      totalCarbs: 51,
    },
    {
      name: "🥔 Potato & Beef",
      items: [
        { qty: "1", item: "potato", carbs: 37 },
        { qty: "1", item: "beef", carbs: 0 },
        { qty: "1", item: "green beans", carbs: 7 },
      ],
      totalCarbs: 44,
    },
    {
      name: "🐟 Salmon & Quinoa",
      items: [
        { qty: "1", item: "salmon", carbs: 0 },
        { qty: "1", item: "quinoa", carbs: 39 },
        { qty: "1", item: "spinach", carbs: 1 },
      ],
      totalCarbs: 40,
    },
    {
      name: "🌮 Chili Bowl",
      items: [
        { qty: "1", item: "chili", carbs: 15 },
        { qty: "1", item: "cheese", carbs: 1 },
      ],
      totalCarbs: 16,
    },
    {
      name: "🍖 Liver Dinner",
      items: [
        { qty: "1", item: "liver dinner", carbs: 17 },
        { qty: "1", item: "carrots", carbs: 10 },
      ],
      totalCarbs: 27,
    },
  ],
  snacks: [
    {
      name: "🍎 Apple",
      items: [{ qty: "1", item: "apple", carbs: 25 }],
      totalCarbs: 25,
    },
    {
      name: "🍌 Banana",
      items: [{ qty: "1", item: "banana", carbs: 27 }],
      totalCarbs: 27,
    },
    {
      name: "🧀 Cheese & Crackers",
      items: [
        { qty: "1", item: "cheese", carbs: 1 },
        { qty: "1", item: "crackers", carbs: 18 },
      ],
      totalCarbs: 19,
    },
    {
      name: "🥜 Nuts",
      items: [{ qty: "1", item: "nuts", carbs: 6 }],
      totalCarbs: 6,
    },
    {
      name: "🍓 Berries & Yogurt",
      items: [
        { qty: "1", item: "strawberries", carbs: 8 },
        { qty: "1", item: "yogurt", carbs: 17 },
      ],
      totalCarbs: 25,
    },
    {
      name: "🥓 Pork Rinds",
      items: [{ qty: "1", item: "pork rinds", carbs: 1 }],
      totalCarbs: 1,
    },
    {
      name: "🥛 Cottage Cheese",
      items: [{ qty: "1", item: "cottage cheese", carbs: 5 }],
      totalCarbs: 5,
    },
  ],
}

interface FoodItem {
  qty: string
  item: string
  carbs: number
}

interface MealSection {
  section: string
  items: FoodItem[]
  total: number
}

export default function FoodJournal() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [customFoods, setCustomFoods] = useState<Record<string, number>>({})
  const [newFoodInput, setNewFoodInput] = useState("")
  const [showCustomFoods, setShowCustomFoods] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState("")
  const [showExport, setShowExport] = useState(false)
  const [exportData, setExportData] = useState("")
  const [mealData, setMealData] = useState<MealSection[]>([
    { section: "Brunch", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
    { section: "Snack", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
    { section: "Dinner", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
    { section: "Evening Snack", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
  ])
  const [customTemplates, setCustomTemplates] = useState<Record<string, any[]>>({})
  const [showSaveTemplate, setShowSaveTemplate] = useState<{ mealIndex: number; show: boolean }>({
    mealIndex: -1,
    show: false,
  })
  const [templateName, setTemplateName] = useState("")
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<{ [key: string]: string[] }>({})
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<{ [key: string]: number }>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const [showSaveReminder, setShowSaveReminder] = useState(false)

  // Combined food database (default + custom) - make it reactive
  const FOOD_DATABASE = useMemo(() => {
    return { ...DEFAULT_FOOD_DATABASE, ...customFoods }
  }, [customFoods])

  // Load custom foods from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("food-journal-custom-foods")
    if (saved) {
      try {
        setCustomFoods(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading custom foods:", error)
      }
    }
  }, [])

  // Save custom foods to localStorage
  const saveCustomFoods = useCallback((foods: Record<string, number>) => {
    localStorage.setItem("food-journal-custom-foods", JSON.stringify(foods))
    setCustomFoods(foods)
  }, [])

  // Add new food to database
  const addNewFood = useCallback(() => {
    const input = newFoodInput.trim()
    if (!input) return

    // Parse format: "food name number" or "food name number g"
    const match = input.match(/^(.+?)\s+(\d+(?:\.\d+)?)\s*g?$/i)
    if (!match) {
      toast({
        title: "Invalid Format",
        description: "Use format: 'food name carbs' (e.g., 'raccoon soup 20')",
        variant: "destructive",
      })
      return
    }

    const foodName = match[1].toLowerCase().trim()
    const carbValue = Number.parseFloat(match[2])

    if (isNaN(carbValue) || carbValue < 0) {
      toast({
        title: "Invalid Carb Value",
        description: "Carb value must be a positive number",
        variant: "destructive",
      })
      return
    }

    const newCustomFoods = { ...customFoods, [foodName]: carbValue }
    saveCustomFoods(newCustomFoods)

    toast({
      title: "Food Added & Saved!",
      description: `${foodName} (${carbValue}g carbs) is now available in your database`,
    })

    setNewFoodInput("")
    setShowCustomFoods(false) // Close the window
  }, [newFoodInput, customFoods, saveCustomFoods, toast])

  // Remove custom food
  const removeCustomFood = useCallback(
    (foodName: string) => {
      const newCustomFoods = { ...customFoods }
      delete newCustomFoods[foodName]
      saveCustomFoods(newCustomFoods)

      toast({
        title: "Food Removed",
        description: `${foodName} removed from database`,
      })
    },
    [customFoods, saveCustomFoods, toast],
  )

  // Load data from localStorage
  const loadData = useCallback((date: string) => {
    const saved = localStorage.getItem(`food-journal-${date}`)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setMealData(
          data.meals || [
            { section: "Brunch", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
            { section: "Snack", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
            { section: "Dinner", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
            { section: "Evening Snack", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
          ],
        )
        setNotes(data.notes || "")
      } catch (error) {
        console.error("Error loading data:", error)
      }
    } else {
      // Reset to empty state
      setMealData([
        { section: "Brunch", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
        { section: "Snack", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
        { section: "Dinner", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
        { section: "Evening Snack", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
      ])
      setNotes("")
    }
  }, [])

  // Import data from text report
  const importFromReport = useCallback(() => {
    if (!importText.trim()) {
      toast({
        title: "No Data to Import",
        description: "Please paste your food journal report",
        variant: "destructive",
      })
      return
    }

    try {
      const lines = importText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)

      let importedCount = 0
      let currentDate = ""
      let currentMealData: FoodItem[] = []

      console.log("Starting import, found lines:", lines.length)

      for (const line of lines) {
        console.log("Processing line:", line)

        // Parse date lines - handle various formats
        const dateMatch = line.match(/^Date:\s*(.+)$/)
        if (dateMatch) {
          // Save previous date's data if exists
          if (currentDate && currentMealData.length > 0) {
            console.log(`Saving data for ${currentDate}:`, currentMealData)

            const mealSections = [
              {
                section: "Brunch",
                items: currentMealData.length > 0 ? currentMealData : [{ qty: "", item: "", carbs: 0 }],
                total: 0,
              },
              { section: "Snack", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
              { section: "Dinner", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
              { section: "Evening Snack", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
            ]

            // Calculate totals
            mealSections.forEach((meal) => {
              meal.total = meal.items.reduce((sum, item) => sum + item.carbs, 0)
            })

            const data = {
              date: currentDate,
              meals: mealSections,
              notes: "",
              timestamp: new Date().toISOString(),
            }
            localStorage.setItem(`food-journal-${currentDate}`, JSON.stringify(data))
            importedCount++
          }

          // Parse new date
          const dateStr = dateMatch[1].trim()
          console.log("Found date:", dateStr)
          const parsedDate = new Date(dateStr)
          if (!isNaN(parsedDate.getTime())) {
            currentDate = parsedDate.toISOString().split("T")[0]
            currentMealData = []
            console.log("Set current date to:", currentDate)
          }
          continue
        }

        // Skip meal headers and totals
        if (line.match(/^Meal \d+:$/) || line.match(/^Total:/) || line.match(/^Daily Total:/)) {
          continue
        }

        // Parse food items - handle multiple formats
        // Format 1: "- Egg x1 (1g)"
        let itemMatch = line.match(/^-\s*(.+?)\s+x(\d+(?:\.\d+)?)\s*$$(\d+(?:\.\d+)?)g$$$/)
        if (itemMatch) {
          const itemName = itemMatch[1].trim().toLowerCase()
          const quantity = Number.parseFloat(itemMatch[2])
          const carbs = Number.parseFloat(itemMatch[3])

          console.log("Found item format 1:", { itemName, quantity, carbs })

          currentMealData.push({
            qty: quantity.toString(),
            item: itemName,
            carbs: carbs,
          })
          continue
        }

        // Format 2: "- Simple Entry (75g)"
        itemMatch = line.match(/^-\s*(.+?)\s*$$(\d+(?:\.\d+)?)g$$$/)
        if (itemMatch) {
          const itemName = itemMatch[1].trim().toLowerCase()
          const carbs = Number.parseFloat(itemMatch[2])

          console.log("Found item format 2:", { itemName, carbs })

          currentMealData.push({
            qty: "1",
            item: itemName,
            carbs: carbs,
          })
          continue
        }

        // Format 3: "- BBQ Pork Rinds 14g (1g)" - complex names with weights
        itemMatch = line.match(/^-\s*(.+?)\s+\d+g\s*$$(\d+(?:\.\d+)?)g$$$/)
        if (itemMatch) {
          const itemName = itemMatch[1].trim().toLowerCase()
          const carbs = Number.parseFloat(itemMatch[2])

          console.log("Found item format 3:", { itemName, carbs })

          currentMealData.push({
            qty: "1",
            item: itemName,
            carbs: carbs,
          })
          continue
        }
      }

      // Save the last date's data
      if (currentDate && currentMealData.length > 0) {
        console.log(`Saving final data for ${currentDate}:`, currentMealData)

        const mealSections = [
          {
            section: "Brunch",
            items: currentMealData.length > 0 ? currentMealData : [{ qty: "", item: "", carbs: 0 }],
            total: 0,
          },
          { section: "Snack", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
          { section: "Dinner", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
          { section: "Evening Snack", items: [{ qty: "", item: "", carbs: 0 }], total: 0 },
        ]

        // Calculate totals
        mealSections.forEach((meal) => {
          meal.total = meal.items.reduce((sum, item) => sum + item.carbs, 0)
        })

        const data = {
          date: currentDate,
          meals: mealSections,
          notes: "",
          timestamp: new Date().toISOString(),
        }
        localStorage.setItem(`food-journal-${currentDate}`, JSON.stringify(data))
        importedCount++
      }

      console.log("Import completed, imported count:", importedCount)

      if (importedCount > 0) {
        toast({
          title: "Import Successful!",
          description: `Imported ${importedCount} days of food journal data`,
        })

        setImportText("")
        setShowImport(false)

        // Reload current date if it was imported
        loadData(selectedDate)
      } else {
        toast({
          title: "No Data Imported",
          description: "No valid food entries were found in the text. Check the format.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: "Import Failed",
        description: "There was an error parsing your food journal report",
        variant: "destructive",
      })
    }
  }, [importText, toast, loadData, selectedDate])

  // Export all data to JSON (without auto-download)
  const exportAllData = useCallback(
    (autoDownload = false) => {
      try {
        const allData: any = {
          exportDate: new Date().toISOString(),
          customFoods,
          customTemplates,
          dailyEntries: {},
        }

        // Get all food journal entries from localStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (
            key &&
            key.startsWith("food-journal-") &&
            !key.includes("custom-foods") &&
            !key.includes("custom-templates")
          ) {
            const data = localStorage.getItem(key)
            if (data) {
              try {
                allData.dailyEntries[key] = JSON.parse(data)
              } catch (error) {
                console.error(`Error parsing data for ${key}:`, error)
              }
            }
          }
        }

        const jsonString = JSON.stringify(allData, null, 2)
        setExportData(jsonString)

        // Only auto-download if explicitly requested
        if (autoDownload) {
          const blob = new Blob([jsonString], { type: "application/json" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `food-journal-backup-${new Date().toISOString().split("T")[0]}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          toast({
            title: "Backup Created!",
            description: `Found ${Object.keys(allData.dailyEntries).length} days of data`,
          })
        }

        return jsonString
      } catch (error) {
        console.error("Export error:", error)
        toast({
          title: "Export Failed",
          description: "There was an error exporting your data",
          variant: "destructive",
        })
        return ""
      }
    },
    [customFoods, customTemplates, toast],
  )

  // Download export data as file
  const downloadExportData = useCallback(() => {
    const blob = new Blob([exportData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `food-journal-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download Started!",
      description: "Your backup file is being downloaded",
    })
  }, [exportData, toast])

  // Import from backup file
  const importFromBackup = useCallback(
    (jsonData: string) => {
      try {
        const data = JSON.parse(jsonData)

        if (!data.dailyEntries) {
          throw new Error("Invalid backup format")
        }

        let importedDays = 0
        let importedCustomFoods = 0
        let importedTemplates = 0

        // Import daily entries
        Object.entries(data.dailyEntries).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value))
          importedDays++
        })

        // Import custom foods
        if (data.customFoods && Object.keys(data.customFoods).length > 0) {
          const mergedCustomFoods = { ...customFoods, ...data.customFoods }
          saveCustomFoods(mergedCustomFoods)
          importedCustomFoods = Object.keys(data.customFoods).length
        }

        // Import custom templates
        if (data.customTemplates && Object.keys(data.customTemplates).length > 0) {
          const mergedTemplates = { ...customTemplates }
          Object.entries(data.customTemplates).forEach(([category, templates]: [string, any]) => {
            mergedTemplates[category] = [...(mergedTemplates[category] || []), ...templates]
          })
          setCustomTemplates(mergedTemplates)
          localStorage.setItem("food-journal-custom-templates", JSON.stringify(mergedTemplates))
          importedTemplates = Object.values(data.customTemplates).flat().length
        }

        toast({
          title: "Backup Restored!",
          description: `Imported ${importedDays} days, ${importedCustomFoods} foods, ${importedTemplates} templates`,
        })

        // Reload current date
        loadData(selectedDate)
        setImportText("")
        setShowImport(false)
      } catch (error) {
        console.error("Import backup error:", error)
        toast({
          title: "Import Failed",
          description: "Invalid backup file format",
          variant: "destructive",
        })
      }
    },
    [customFoods, customTemplates, saveCustomFoods, toast, loadData, selectedDate],
  )

  // Save custom template
  const saveCustomTemplate = useCallback(
    (mealIndex: number, name: string) => {
      const meal = mealData[mealIndex]
      const validItems = meal.items.filter((item) => item.item.trim() && item.qty.trim())

      if (validItems.length === 0) {
        toast({
          title: "No Items to Save",
          description: "Add some food items before saving as a template",
          variant: "destructive",
        })
        return
      }

      const template = {
        name: `🍽️ ${name}`,
        items: validItems.map((item) => ({
          qty: item.qty,
          item: item.item,
          carbs: item.carbs,
        })),
        totalCarbs: meal.total,
        category: meal.section.toLowerCase().includes("brunch")
          ? "breakfast"
          : meal.section.toLowerCase().includes("dinner")
            ? "dinner"
            : "snacks",
      }

      const category = template.category
      const newCustomTemplates = {
        ...customTemplates,
        [category]: [...(customTemplates[category] || []), template],
      }

      setCustomTemplates(newCustomTemplates)
      localStorage.setItem("food-journal-custom-templates", JSON.stringify(newCustomTemplates))

      toast({
        title: "Template Saved!",
        description: `"${name}" has been saved as a custom template`,
      })

      setTemplateName("")
      setShowSaveTemplate({ mealIndex: -1, show: false })
    },
    [mealData, customTemplates, toast],
  )

  // Remove custom template
  const removeCustomTemplate = useCallback(
    (category: string, templateIndex: number) => {
      const newCustomTemplates = { ...customTemplates }
      newCustomTemplates[category].splice(templateIndex, 1)

      if (newCustomTemplates[category].length === 0) {
        delete newCustomTemplates[category]
      }

      setCustomTemplates(newCustomTemplates)
      localStorage.setItem("food-journal-custom-templates", JSON.stringify(newCustomTemplates))

      toast({
        title: "Template Removed",
        description: "Custom template has been removed",
      })
    },
    [customTemplates, toast],
  )

  // Calculate carbs for a food item
  const calculateItemCarbs = useCallback(
    (item: string, qty: string): number => {
      const foodName = item.toLowerCase().trim()
      const quantity = Number.parseFloat(qty)

      // Don't calculate if either field is empty or qty is invalid
      if (!foodName || !qty.trim() || isNaN(quantity) || quantity <= 0) {
        return 0
      }

      // Exact match first
      if (FOOD_DATABASE[foodName]) {
        return FOOD_DATABASE[foodName] * quantity
      }

      // Partial match - but only if the input is at least 3 characters to avoid false matches
      if (foodName.length >= 3) {
        const partialMatch = Object.keys(FOOD_DATABASE).find(
          (food) => food.includes(foodName) || foodName.includes(food),
        )

        if (partialMatch) {
          return FOOD_DATABASE[partialMatch] * quantity
        }
      }

      return 0
    },
    [FOOD_DATABASE],
  )

  // Get autocomplete suggestions
  const getAutocompleteSuggestions = useCallback(
    (input: string): string[] => {
      if (!input || input.length < 1) return []

      const inputLower = input.toLowerCase()
      const suggestions = Object.keys(FOOD_DATABASE)
        .filter((food) => food.startsWith(inputLower))
        .slice(0, 5)

      return suggestions
    },
    [FOOD_DATABASE],
  )

  // Handle autocomplete for food items
  const handleFoodItemChange = useCallback(
    (mealIndex: number, itemIndex: number, value: string) => {
      const inputKey = `${mealIndex}-${itemIndex}`

      // Update the meal data
      setMealData((prev) => {
        const newData = [...prev]
        const item = { ...newData[mealIndex].items[itemIndex] }
        item.item = value
        item.carbs = calculateItemCarbs(value, item.qty)
        newData[mealIndex].items[itemIndex] = item
        newData[mealIndex].total = newData[mealIndex].items.reduce((sum, item) => sum + item.carbs, 0)
        return newData
      })

      // Update autocomplete suggestions
      const suggestions = getAutocompleteSuggestions(value)
      setAutocompleteSuggestions((prev) => ({
        ...prev,
        [inputKey]: suggestions,
      }))
      setSelectedSuggestionIndex((prev) => ({
        ...prev,
        [inputKey]: -1,
      }))
    },
    [calculateItemCarbs, getAutocompleteSuggestions],
  )

  // Handle keyboard navigation for autocomplete
  const handleFoodItemKeyDown = useCallback(
    (e: React.KeyboardEvent, mealIndex: number, itemIndex: number) => {
      const inputKey = `${mealIndex}-${itemIndex}`
      const suggestions = autocompleteSuggestions[inputKey] || []
      const selectedIndex = selectedSuggestionIndex[inputKey] || -1

      if (suggestions.length === 0) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        const newIndex = selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : 0
        setSelectedSuggestionIndex((prev) => ({
          ...prev,
          [inputKey]: newIndex,
        }))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const newIndex = selectedIndex > 0 ? selectedIndex - 1 : suggestions.length - 1
        setSelectedSuggestionIndex((prev) => ({
          ...prev,
          [inputKey]: newIndex,
        }))
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault()
        const selectedSuggestion = suggestions[selectedIndex]
        handleFoodItemChange(mealIndex, itemIndex, selectedSuggestion)
        setAutocompleteSuggestions((prev) => ({
          ...prev,
          [inputKey]: [],
        }))
      } else if (e.key === "Escape") {
        setAutocompleteSuggestions((prev) => ({
          ...prev,
          [inputKey]: [],
        }))
      } else if (e.key === "Tab" && selectedIndex >= 0) {
        e.preventDefault()
        const selectedSuggestion = suggestions[selectedIndex]
        handleFoodItemChange(mealIndex, itemIndex, selectedSuggestion)
        setAutocompleteSuggestions((prev) => ({
          ...prev,
          [inputKey]: [],
        }))
      }
    },
    [autocompleteSuggestions, selectedSuggestionIndex, handleFoodItemChange],
  )

  // Update meal item
  const updateMealItem = useCallback(
    (mealIndex: number, itemIndex: number, field: "qty" | "item", value: string) => {
      if (field === "item") {
        handleFoodItemChange(mealIndex, itemIndex, value)
      } else {
        setMealData((prev) => {
          const newData = [...prev]
          const item = { ...newData[mealIndex].items[itemIndex] }
          item[field] = value
          item.carbs = calculateItemCarbs(item.item, value)
          newData[mealIndex].items[itemIndex] = item
          newData[mealIndex].total = newData[mealIndex].items.reduce((sum, item) => sum + item.carbs, 0)
          return newData
        })
      }
    },
    [handleFoodItemChange, calculateItemCarbs],
  )

  // Add new food item to a meal
  const addFoodItem = useCallback((mealIndex: number) => {
    setMealData((prev) => {
      const newData = [...prev]
      newData[mealIndex].items.push({ qty: "", item: "", carbs: 0 })
      return newData
    })
  }, [])

  // Remove food item from a meal
  const removeFoodItem = useCallback((mealIndex: number, itemIndex: number) => {
    setMealData((prev) => {
      const newData = [...prev]
      if (newData[mealIndex].items.length > 1) {
        newData[mealIndex].items.splice(itemIndex, 1)
        // Recalculate section total
        newData[mealIndex].total = newData[mealIndex].items.reduce((sum, item) => sum + item.carbs, 0)
      }
      return newData
    })
  }, [])

  // Add meal template
  const addMealTemplate = useCallback(
    (mealIndex: number, template: any) => {
      setMealData((prev) => {
        const newData = [...prev]

        // Clear existing empty items
        const hasEmptyItems = newData[mealIndex].items.some((item) => !item.item.trim() && !item.qty.trim())
        if (hasEmptyItems) {
          newData[mealIndex].items = newData[mealIndex].items.filter((item) => item.item.trim() || item.qty.trim())
        }

        // Add template items
        template.items.forEach((templateItem: any) => {
          newData[mealIndex].items.push({
            qty: templateItem.qty,
            item: templateItem.item,
            carbs: calculateItemCarbs(templateItem.item, templateItem.qty),
          })
        })

        // Recalculate section total
        newData[mealIndex].total = newData[mealIndex].items.reduce((sum, item) => sum + item.carbs, 0)

        return newData
      })

      toast({
        title: "Template Added!",
        description: `${template.name} has been added to your meal.`,
      })
    },
    [calculateItemCarbs, toast],
  )

  // Get appropriate templates for meal section
  const getTemplatesForSection = useCallback(
    (sectionName: string) => {
      const section = sectionName.toLowerCase()
      let defaultTemplates = MEAL_TEMPLATES.snacks // Default fallback

      if (section.includes("brunch")) defaultTemplates = MEAL_TEMPLATES.breakfast
      if (section.includes("dinner")) defaultTemplates = MEAL_TEMPLATES.dinner
      if (section.includes("snack")) defaultTemplates = MEAL_TEMPLATES.snacks

      // Get the category for custom templates
      const category = section.includes("brunch") ? "breakfast" : section.includes("dinner") ? "dinner" : "snacks"

      // Combine default templates with custom ones
      const customTemplatesForSection = customTemplates[category] || []
      return [...defaultTemplates, ...customTemplatesForSection]
    },
    [customTemplates],
  )

  // Calculate notes carbs (extract numbers followed by 'g')
  const calculateNotesCarbs = useCallback((notesText: string): number => {
    const matches = notesText.match(/(\d+(?:\.\d+)?)\s*g/gi)
    if (!matches) return 0

    return matches.reduce((sum, match) => {
      const num = Number.parseFloat(match)
      return sum + (isNaN(num) ? 0 : num)
    }, 0)
  }, [])

  // Calculate total carbs
  const totalCarbs = mealData.reduce((sum, meal) => sum + meal.total, 0) + calculateNotesCarbs(notes)
  const notesCarbs = calculateNotesCarbs(notes)

  // Save data to localStorage only (no auto-backup)
  const saveDataOnly = useCallback(() => {
    const data = {
      date: selectedDate,
      meals: mealData,
      notes,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(`food-journal-${selectedDate}`, JSON.stringify(data))

    // Mark as having unsaved changes for backup
    setHasUnsavedChanges(true)
  }, [selectedDate, mealData, notes])

  // Save data and create backup file
  const saveData = useCallback(() => {
    // Save to localStorage
    saveDataOnly()

    // Create and download backup file
    exportAllData(true)

    // Mark as saved
    setHasUnsavedChanges(false)
    setLastSaveTime(new Date())

    toast({
      title: "Data Saved & Backed Up!",
      description: "Your food journal has been saved locally and backup file downloaded.",
    })
  }, [saveDataOnly, exportAllData, toast])

  // Load custom templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("food-journal-custom-templates")
    if (saved) {
      try {
        setCustomTemplates(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading custom templates:", error)
      }
    }
  }, [])

  // Load data when date changes
  useEffect(() => {
    loadData(selectedDate)
  }, [selectedDate, loadData])

  // Auto-save to localStorage every 2 minutes (no backup file)
  useEffect(() => {
    const interval = setInterval(saveDataOnly, 120000) // 2 minutes
    return () => clearInterval(interval)
  }, [saveDataOnly])

  // Reminder system for saving before closing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges || !lastSaveTime) {
        e.preventDefault()
        e.returnValue =
          "You have unsaved changes! Please use the 'Save & Backup' button before leaving to download your backup file."
        return "You have unsaved changes! Please use the 'Save & Backup' button before leaving to download your backup file."
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges, lastSaveTime])

  // Periodic save reminder
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges && lastSaveTime) {
        const timeSinceLastSave = Date.now() - lastSaveTime.getTime()
        const minutesSinceLastSave = timeSinceLastSave / (1000 * 60)

        if (minutesSinceLastSave > 10) {
          // Remind after 10 minutes
          setShowSaveReminder(true)
        }
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [hasUnsavedChanges, lastSaveTime])

  // Mark changes when data is modified
  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [mealData, notes])

  // Remove the pending backup check since we're trying direct download
  // Comment out or remove the "Check for pending backup on load" useEffect

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
              🥗 Food Journal
              <Badge variant="outline" className="ml-2 text-sm bg-gray-100">
                v22
              </Badge>
            </h1>
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              Daily Limit: 100g
            </Badge>
            <Button
              onClick={saveData}
              variant="outline"
              size="sm"
              className={hasUnsavedChanges ? "border-yellow-400 text-yellow-700" : ""}
            >
              <Save className="h-4 w-4 mr-2" />
              Save & Backup
              {hasUnsavedChanges && <span className="ml-1">●</span>}
            </Button>
            {lastSaveTime && (
              <Badge variant="secondary" className="text-xs">
                Last backup: {lastSaveTime.toLocaleTimeString()}
              </Badge>
            )}
            <Button
              onClick={() => setShowCustomFoods(!showCustomFoods)}
              variant="outline"
              size="sm"
              className="text-purple-700 border-purple-300"
            >
              <Database className="h-4 w-4 mr-2" />
              Food Database
            </Button>
            <Button
              onClick={() => setShowImport(!showImport)}
              variant="outline"
              size="sm"
              className="text-blue-700 border-blue-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button
              onClick={() => {
                exportAllData(false)
                setShowExport(true)
              }}
              variant="outline"
              size="sm"
              className="text-green-700 border-green-300"
            >
              <Save className="h-4 w-4 mr-2" />
              Export Backup
            </Button>
          </div>
        </div>

        {/* Custom Food Database Section */}
        {showCustomFoods && (
          <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                <Database className="h-5 w-5" />
                Food Database Manager
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., raccoon soup 20"
                  value={newFoodInput}
                  onChange={(e) => setNewFoodInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNewFood()}
                  className="flex-1"
                />
                <Button onClick={addNewFood} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Food
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                💡 Format: "food name carbs" (e.g., "raccoon soup 20" or "special bread 15")
              </p>

              {Object.keys(customFoods).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Your Custom Foods:</h4>
                  <div className="grid gap-2 max-h-40 overflow-y-auto">
                    {Object.entries(customFoods).map(([food, carbs]) => (
                      <div key={food} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-sm">
                          <strong>{food}</strong> - {carbs}g carbs
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomFood(food)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Import Data Section */}
        {showImport && (
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Import Food Journal Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Paste your food journal report below to import historical data:</p>
                <Textarea
                  placeholder="Paste your food journal report here..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={importFromReport} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
                <Button
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = ".json"
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          const content = e.target?.result as string
                          importFromBackup(content)
                        }
                        reader.readAsText(file)
                      }
                    }
                    input.click()
                  }}
                  variant="outline"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Restore Backup
                </Button>
                <Button variant="outline" onClick={() => setShowImport(false)}>
                  Cancel
                </Button>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>💡 Supported format:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs">
                  {`Date: May 24, 2025
  Meal 1:
    - Egg x1 (1g)
    - Cottage Cheese x2 (10g)
  Daily Total: 11g carbs`}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export Data Section */}
        {showExport && (
          <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
                <Save className="h-5 w-5" />
                Export Food Journal Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Your complete food journal backup (all days, custom foods, and templates):
                </p>
                <Textarea value={exportData} readOnly className="min-h-[200px] font-mono text-xs bg-gray-50" />
              </div>
              <div className="flex gap-2">
                <Button onClick={downloadExportData} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Download Backup File
                </Button>
                <Button variant="outline" onClick={() => setShowExport(false)}>
                  Close
                </Button>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>💡 This backup includes:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>All daily food entries</li>
                  <li>Custom foods database</li>
                  <li>Custom meal templates</li>
                  <li>Export timestamp</li>
                </ul>
                <p className="mt-2">📁 Save this file safely - you can restore it later using the Import feature!</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Template Dialog */}
        {showSaveTemplate.show && (
          <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
                <Save className="h-5 w-5" />
                Save Meal as Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Save your current {mealData[showSaveTemplate.mealIndex]?.section.toLowerCase()} as a reusable
                  template:
                </p>
                <div className="bg-white p-3 rounded border">
                  {mealData[showSaveTemplate.mealIndex]?.items
                    .filter((item) => item.item.trim() && item.qty.trim())
                    .map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.qty} {item.item}
                        </span>
                        <span>{item.carbs.toFixed(1)}g</span>
                      </div>
                    ))}
                  <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                    <span>Total:</span>
                    <span>{mealData[showSaveTemplate.mealIndex]?.total.toFixed(1)}g carbs</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Template name (e.g., 'My Breakfast')"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    templateName.trim() &&
                    saveCustomTemplate(showSaveTemplate.mealIndex, templateName.trim())
                  }
                  className="flex-1"
                />
                <Button
                  onClick={() =>
                    templateName.trim() && saveCustomTemplate(showSaveTemplate.mealIndex, templateName.trim())
                  }
                  disabled={!templateName.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Save Template
                </Button>
                <Button variant="outline" onClick={() => setShowSaveTemplate({ mealIndex: -1, show: false })}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Reminder Dialog */}
        {showSaveReminder && (
          <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
                <Save className="h-5 w-5" />💾 Save Reminder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  It's been a while since your last backup! Your data is auto-saved locally, but don't forget to create
                  a backup file.
                </p>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm">
                    <strong>Last backup:</strong> {lastSaveTime ? lastSaveTime.toLocaleString() : "Never"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    💡 Use "Save & Backup" to download a backup file you can restore later
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveData} className="bg-yellow-600 hover:bg-yellow-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save & Backup Now
                </Button>
                <Button variant="outline" onClick={() => setShowSaveReminder(false)}>
                  Remind Me Later
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Summary Card */}
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Total Carbohydrates</p>
                <p className="text-3xl font-bold text-green-700">{totalCarbs.toFixed(1)}g</p>
                <p className="text-sm text-gray-500">
                  {totalCarbs <= 100
                    ? `${(100 - totalCarbs).toFixed(1)}g remaining`
                    : `${(totalCarbs - 100).toFixed(1)}g over limit`}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-gray-600">Limit Usage</p>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        totalCarbs <= 70
                          ? "bg-gradient-to-r from-green-400 to-green-600"
                          : totalCarbs <= 85
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                            : totalCarbs <= 100
                              ? "bg-gradient-to-r from-orange-400 to-orange-600"
                              : "bg-gradient-to-r from-red-400 to-red-600"
                      }`}
                      style={{ width: `${Math.min((totalCarbs / 100) * 100, 100)}%` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      totalCarbs <= 70
                        ? "text-green-700"
                        : totalCarbs <= 85
                          ? "text-yellow-700"
                          : totalCarbs <= 100
                            ? "text-orange-700"
                            : "text-red-700"
                    }`}
                  >
                    {Math.round((totalCarbs / 100) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meal Sections */}
        <div className="grid gap-4">
          {mealData.map((meal, mealIndex) => (
            <Card key={mealIndex} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800">{meal.section}</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {meal.total.toFixed(1)}g carbs
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {meal.items.map((item, itemIndex) => {
                  const inputKey = `${mealIndex}-${itemIndex}`
                  const suggestions = autocompleteSuggestions[inputKey] || []
                  const selectedIndex = selectedSuggestionIndex[inputKey] || -1

                  return (
                    <div key={itemIndex} className="relative">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Input
                          placeholder="Qty"
                          value={item.qty}
                          onChange={(e) => updateMealItem(mealIndex, itemIndex, "qty", e.target.value)}
                          className="w-16 text-center"
                          maxLength={3}
                        />
                        <div className="flex-1 relative">
                          <Input
                            placeholder="Food item..."
                            value={item.item}
                            onChange={(e) => updateMealItem(mealIndex, itemIndex, "item", e.target.value)}
                            onKeyDown={(e) => handleFoodItemKeyDown(e, mealIndex, itemIndex)}
                            onBlur={() => {
                              // Hide suggestions after a short delay to allow clicking
                              setTimeout(() => {
                                setAutocompleteSuggestions((prev) => ({
                                  ...prev,
                                  [inputKey]: [],
                                }))
                              }, 150)
                            }}
                            className="w-full"
                            maxLength={30}
                          />
                          {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                              {suggestions.map((suggestion, suggestionIndex) => (
                                <div
                                  key={suggestion}
                                  className={`px-3 py-2 cursor-pointer text-sm ${
                                    suggestionIndex === selectedIndex
                                      ? "bg-blue-100 text-blue-900"
                                      : "hover:bg-gray-100"
                                  }`}
                                  onMouseDown={(e) => {
                                    e.preventDefault()
                                    handleFoodItemChange(mealIndex, itemIndex, suggestion)
                                    setAutocompleteSuggestions((prev) => ({
                                      ...prev,
                                      [inputKey]: [],
                                    }))
                                  }}
                                >
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="min-w-[60px] justify-center">
                          {item.item.trim() || item.qty.trim() ? `${item.carbs.toFixed(1)}g` : "—"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeFoodItem(mealIndex, itemIndex)}
                          disabled={meal.items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-dashed border-2 border-gray-300 hover:border-gray-400"
                    onClick={() => addFoodItem(mealIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Food Item
                  </Button>

                  <Button
                    variant="outline"
                    className="border-2 border-green-300 hover:border-green-400 text-green-700"
                    onClick={() => setShowSaveTemplate({ mealIndex, show: true })}
                    disabled={meal.items.every((item) => !item.item.trim() && !item.qty.trim())}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-2 border-blue-300 hover:border-blue-400 text-blue-700"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Quick Add
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
                      <DropdownMenuLabel>Meal Templates</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {getTemplatesForSection(meal.section).map((template, templateIndex) => (
                        <DropdownMenuItem
                          key={templateIndex}
                          onClick={() => addMealTemplate(mealIndex, template)}
                          className="cursor-pointer group"
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="flex-1">{template.name}</span>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="ml-2">
                                {template.totalCarbs}g
                              </Badge>
                              {template.name.startsWith("🍽️") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 h-auto"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const category = meal.section.toLowerCase().includes("brunch")
                                      ? "breakfast"
                                      : meal.section.toLowerCase().includes("dinner")
                                        ? "dinner"
                                        : "snacks"
                                    const customIndex =
                                      templateIndex -
                                      (meal.section.toLowerCase().includes("brunch")
                                        ? MEAL_TEMPLATES.breakfast.length
                                        : meal.section.toLowerCase().includes("dinner")
                                          ? MEAL_TEMPLATES.dinner.length
                                          : MEAL_TEMPLATES.snacks.length)
                                    if (customIndex >= 0) {
                                      removeCustomTemplate(category, customIndex)
                                    }
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Notes Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">Notes & Additional Items</CardTitle>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {notesCarbs.toFixed(1)}g carbs
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add notes, additional foods, or carb amounts (e.g., '15g from snack')..."
              className="min-h-[100px] resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Type carb amounts like "15g" and they'll be automatically calculated
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-800">
                {mealData.reduce((count, meal) => count + meal.items.filter((item) => item.item.trim()).length, 0)}
              </p>
              <p className="text-sm text-gray-600">Food Items Today</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-800">{Math.round((totalCarbs / 100) * 100)}%</p>
              <p className="text-sm text-gray-600">Limit Used</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Database className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-gray-800">{Object.keys(customFoods).length}</p>
              <p className="text-sm text-gray-600">Custom Foods</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
