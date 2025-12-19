'use client';

import { useState } from 'react';
import posthog from 'posthog-js';
import {
  SendIcon,
  Wrench,
  ChevronDown,
  ChevronsUpDown,
  GlobeIcon,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeroChatSVG } from './HeroChatSVG';

export const LandingChatDemo = () => {
  return (
    <div className="relative w-full h-full">
      <HeroChatSVG />
    </div>
  );
};
