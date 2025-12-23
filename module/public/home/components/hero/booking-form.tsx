"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, Calendar, User, Phone } from "lucide-react";
import { useForm } from "react-hook-form";

export interface BookingFormData {
  name: string;
  phone: string;
  date: string;
}

export default function BookingForm() {
  const [loading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      name: "",
      phone: "",
      date: "",
    },
  });

  const onSubmit = (data: BookingFormData) => console.log(data);

  const submitButtonText = loading ? "Slanje..." : "Zakažite sada";

  return (
    <div className="bg-card/95 backdrop-blur-md rounded-4xl p-8 shadow-hover border border-border/50">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
          Brzo zakazivanje
        </h3>
        <p className="text-muted-foreground text-sm">
          Popunite formu i javićemo vam se u roku od 30 minuta
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Vaše ime i prezime"
            {...register("name", { required: "Ime je obavezno" })}
            className="pl-12 h-14 rounded-xl border-border bg-background/50"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="tel"
            placeholder="Broj telefona"
            {...register("phone", { required: "Broj telefona je obavezan" })}
            className="pl-12 h-14 rounded-xl border-border bg-background/50"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="date"
            {...register("date", { required: "Datum je obavezan" })}
            className="pl-12 h-14 rounded-xl border-border bg-background/50"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full text-xl py-8 bg-linear-to-r from-cyan-600 to-cyan-400 hover:shadow-hover hover:scale-[1.02] active:scale-[0.98] rounded-4xl cursor-pointer"
        >
          {submitButtonText}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          <span>Besplatna konsultacija</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          <span>Bez čekanja</span>
        </div>
      </div>
    </div>
  );
}
