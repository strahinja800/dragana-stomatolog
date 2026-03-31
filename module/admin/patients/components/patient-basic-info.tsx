'use client';

import { useLocale, useTranslations } from 'next-intl';

import { format } from 'date-fns';
import { enUS, sr } from 'date-fns/locale';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { LucideIcon } from '@/constants/icons';
import {
  AlertCircle,
  Calendar,
  FileText,
  Mail,
  Phone,
  Pill,
  ShieldCheck,
  User,
  Users,
} from '@/constants/icons';
import type { PatientData } from '@/module/admin/patients/types/patient-types';

interface PatientBasicInfoProps {
  patient: PatientData;
}

function InfoField({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function PatientBasicInfo({ patient }: PatientBasicInfoProps) {
  const t = useTranslations('admin.patients');
  const locale = useLocale();
  const dateLocale = locale === 'sr' ? sr : enUS;

  const genderLabel =
    patient.gender === 'MALE'
      ? t('male')
      : patient.gender === 'FEMALE'
        ? t('female')
        : null;

  const dateOfBirthLabel = patient.dateOfBirth
    ? format(new Date(patient.dateOfBirth), 'd. MMMM yyyy.', {
        locale: dateLocale,
      })
    : null;

  const statusLabel = patient.isMain
    ? t('primaryPatient')
    : t('secondaryPatient');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('basicInfo')}</CardTitle>
        <CardDescription>{t('basicInfoDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <InfoField
          icon={User}
          label={t('firstName')}
          value={patient.firstName}
        />
        <InfoField icon={User} label={t('lastName')} value={patient.lastName} />
        {patient.email && (
          <InfoField icon={Mail} label={t('email')} value={patient.email} />
        )}
        {patient.phone && (
          <InfoField icon={Phone} label={t('phone')} value={patient.phone} />
        )}
        {dateOfBirthLabel && (
          <InfoField
            icon={Calendar}
            label={t('dateOfBirth')}
            value={dateOfBirthLabel}
          />
        )}
        {genderLabel && (
          <InfoField icon={Users} label={t('gender')} value={genderLabel} />
        )}
        {patient.allergies && (
          <InfoField
            icon={AlertCircle}
            label={t('allergies')}
            value={patient.allergies}
          />
        )}
        {patient.medications && (
          <InfoField
            icon={Pill}
            label={t('medications')}
            value={patient.medications}
          />
        )}
        <InfoField icon={ShieldCheck} label={t('status')} value={statusLabel} />
        {patient.notes && (
          <div className="md:col-span-2">
            <InfoField
              icon={FileText}
              label={t('notes')}
              value={patient.notes}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
