'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sparkles,
  Star,
  ArrowRight,
  CheckCircle,
  Calendar,
  User,
  Phone,
} from 'lucide-react'
import Image from 'next/image'
import { heroImage, dentist1, dentist2 } from '@/data/data'

export default function HeroSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Booking submitted:', formData)
    // TODO: Make booking work
  }

  return (
    <section className='relative min-h-screen flex items-center overflow-hidden mt-20'>
      {/* Full background image */}
      <div className='absolute inset-0'>
        <Image
          src={heroImage}
          alt='Moderna stomatološka ordinacija'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-linear-to-r from-foreground/80 via-foreground/50 to-transparent' />
      </div>

      <div className='container mx-auto px-4 py-20 relative z-10'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-8 animate-fade-up'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground text-sm font-medium border border-primary/30'>
              <Sparkles className='w-4 h-4' />
              <span>Vaš savršen osmeh počinje ovde</span>
            </div>

            <h1 className='text-5xl md:text-6xl lg:text-8xl font-heading font-bold text-primary-foreground leading-tighter'>
              Stomatologija koja
              <span className='block text-primary'> inspiriše osmeh</span>
            </h1>

            <p className='text-lg text-primary-foreground/80 max-w-xl leading-relaxed'>
              Bilo da niste bili kod zubara 6 meseci ili 6 godina, olakšavamo
              vam povratak sa nežnom negom i bez osude.
            </p>

            <div className='flex items-center gap-6 pt-4'>
              <div className='flex -space-x-3'>
                {[dentist1, dentist2].map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={`Tim ${i + 1}`}
                    className='w-12 h-12 rounded-full border-2 border-primary-foreground object-cover'
                  />
                ))}
                <div className='w-12 h-12 rounded-full bg-primary flex items-center justify-center border-2 border-primary-foreground'>
                  <span className='text-primary-foreground text-sm font-semibold'>
                    +5
                  </span>
                </div>
              </div>
              <div>
                <div className='flex items-center gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 fill-primary text-primary'
                    />
                  ))}
                </div>
                <p className='text-sm text-primary-foreground/70'>
                  Preko 500+ recenzija
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div
            className='animate-fade-up '
            style={{ animationDelay: '0.2s' }}
          >
            <div className='bg-card/95 backdrop-blur-md rounded-4xl p-8 shadow-hover border border-border/50'>
              <div className='text-center mb-6'>
                <h3 className='text-2xl font-heading font-bold text-foreground mb-2'>
                  Brzo zakazivanje
                </h3>
                <p className='text-muted-foreground text-sm'>
                  Popunite formu i javićemo vam se u roku od 30 minuta
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className='space-y-4'
              >
                <div className='relative'>
                  <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                  <Input
                    type='text'
                    placeholder='Vaše ime i prezime'
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className='pl-12 h-14 rounded-xl border-border bg-background/50'
                  />
                </div>

                <div className='relative'>
                  <Phone className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                  <Input
                    type='tel'
                    placeholder='Broj telefona'
                    value={formData.phone}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className='pl-12 h-14 rounded-xl border-border bg-background/50'
                  />
                </div>

                <div className='relative'>
                  <Calendar className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                  <Input
                    type='date'
                    value={formData.date}
                    onChange={e =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className='pl-12 h-14 rounded-xl border-border bg-background/50'
                  />
                </div>

                <Button
                  type='submit'
                  size='lg'
                  className='w-full text-xl py-8 bg-linear-to-r from-cyan-600 to-cyan-400 hover:shadow-hover hover:scale-[1.02] active:scale-[0.98] rounded-4xl'
                >
                  Zakaži pregled
                  <ArrowRight className='w-5 h-5 ml-2' />
                </Button>
              </form>

              <div className='mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground'>
                <div className='flex items-center gap-2'>
                  <CheckCircle className='w-4 h-4 text-primary' />
                  <span>Besplatna konsultacija</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle className='w-4 h-4 text-primary' />
                  <span>Bez čekanja</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
