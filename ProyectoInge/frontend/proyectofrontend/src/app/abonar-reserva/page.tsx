"use client"

import { useState } from "react"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CardsPaymentMethod() {
  const [metodoPago, setMetodoPago] = useState("tarjeta")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de Pago</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Selección del método */}
        <RadioGroup
          defaultValue="tarjeta"
          className="grid grid-cols-2 gap-4"
          onValueChange={(value) => setMetodoPago(value)}
        >
          <div>
            <RadioGroupItem
              value="tarjeta"
              id="tarjeta"
              className="peer sr-only"
              aria-label="Tarjeta de Crédito"
            />
            <Label
              htmlFor="tarjeta"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
            >
              <Icons.creditcard className="mb-3 h-6 w-6" />
              Tarjeta de Crédito
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="mercado-pago"
              id="mercado-pago"
              className="peer sr-only"
              aria-label="Mercado Pago"
            />
            <Label
              htmlFor="mercado-pago"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
            >
              <Icons.mercadoPago className="mb-3 h-6 w-6" />
              Mercado Pago
            </Label>
          </div>
        </RadioGroup>

        {/* Campos obligatorios de tarjeta */}
        <div className="grid gap-2">
          <Label htmlFor="number">Número de tarjeta</Label>
          <Input id="number" placeholder="XXXX XXXX XXXX XXXX" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="month">Mes</Label>
            <Select>
              <SelectTrigger id="month" aria-label="Mes">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ].map((month, idx) => (
                  <SelectItem key={idx + 1} value={`${idx + 1}`}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Año</Label>
            <Select>
              <SelectTrigger id="year" aria-label="Año">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i
                  return (
                    <SelectItem key={year} value={`${year}`}>
                      {year}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="CVC" />
          </div>
        </div>

        {/* Nombre solo si es tarjeta */}
        {metodoPago === "tarjeta" && (
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre en la tarjeta</Label>
            <Input id="name" placeholder="Nombre y Apellido" />
          </div>
        )}

        {/* Mensaje Mercado Pago */}
        {metodoPago === "mercado-pago" && (
          <div className="text-sm text-muted-foreground">
            Serás redirigido a Mercado Pago para completar tu compra, pero primero validaremos tu tarjeta.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          {metodoPago === "mercado-pago" ? "Pagar con Mercado Pago" : "Pagar con Tarjeta"}
        </Button>
      </CardFooter>
    </Card>
  )
}
