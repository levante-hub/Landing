"use client"

import { useState } from "react"
import { X, ArrowRight, ArrowLeft } from "lucide-react"
import { submitQuestionnaire } from "@/lib/supabase/queries"
import posthog from 'posthog-js'

interface QuestionnaireProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
  linkedin: string
  intention: 'active' | 'observer' | ''
  role: 'marketer' | 'designer' | 'frontend' | 'backend' | 'devops' | 'other' | ''
  roleOther: string
  experience: 'beginner' | 'intermediate' | 'advanced' | 'none' | ''
  timeCommitment: '1-3' | '4-8' | '9-15' | '15+' | ''
  timestamp: string
  completedPath: 'full' | 'observer' | ''
}

export function Questionnaire({ isOpen, onClose }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<FormData>({
    name: '',
    linkedin: '',
    intention: '',
    role: '',
    roleOther: '',
    experience: '',
    timeCommitment: '',
    timestamp: new Date().toISOString(),
    completedPath: ''
  })

  // Calcular pasos totales dinámicamente
  const getTotalSteps = () => {
    if (formData.intention === 'observer') return 3
    return 6
  }

  // Calcular progreso
  const getProgress = () => {
    return Math.round((currentStep / getTotalSteps()) * 100)
  }

  // Validación de URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return url.includes('linkedin.com')
    } catch {
      return false
    }
  }

  // Validación por paso
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1: // Información básica
        if (!formData.name.trim() || formData.name.trim().length < 2) {
          newErrors.name = 'Name is required (minimum 2 characters)'
        }
        if (!formData.linkedin.trim()) {
          newErrors.linkedin = 'LinkedIn URL is required'
        } else if (!isValidUrl(formData.linkedin)) {
          newErrors.linkedin = 'Please enter a valid LinkedIn URL'
        }
        break

      case 2: // Intención
        if (!formData.intention) {
          newErrors.intention = 'Please select your intention'
        }
        break

      case 3: // Rol (solo para active)
        if (!formData.role) {
          newErrors.role = 'Please select your role'
        }
        if (formData.role === 'other' && !formData.roleOther.trim()) {
          newErrors.roleOther = 'Please specify your role'
        }
        break

      case 4: // Experiencia (solo para active)
        if (!formData.experience) {
          newErrors.experience = 'Please select your experience level'
        }
        break

      case 5: // Tiempo (solo para active)
        if (!formData.timeCommitment) {
          newErrors.timeCommitment = 'Please select your time commitment'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Envío del formulario
  const submitForm = async (data: FormData) => {
    if (submissionStatus === 'success') return

    setIsSubmitting(true)

    try {
      await submitQuestionnaire({
        name: data.name,
        linkedin: data.linkedin,
        intention: data.intention,
        role: data.role || undefined,
        roleOther: data.roleOther || undefined,
        experience: data.experience || undefined,
        timeCommitment: data.timeCommitment || undefined,
        completedPath: data.completedPath
      })

      setSubmissionStatus('success')
      posthog.capture('questionnaire-submitted', {
        intention: data.intention,
        role: data.role,
        experience: data.experience,
        time_commitment: data.timeCommitment,
        completed_path: data.completedPath
      })
    } catch (error) {
      console.error('Error submitting questionnaire:', error)
      setSubmissionStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Navegación
  const handleNext = async () => {
    if (!validateStep(currentStep)) return

    // Caso especial: Observer en paso 2 → salta al final
    if (currentStep === 2 && formData.intention === 'observer') {
      const finalData = {
        ...formData,
        completedPath: 'observer' as const
      }
      setFormData(finalData)
      await submitForm(finalData)
      setCurrentStep(getTotalSteps())
    }
    // Última pregunta → submit y avanzar a pantalla final
    else if (currentStep === getTotalSteps() - 1) {
      const finalData = {
        ...formData,
        completedPath: 'full' as const
      }
      setFormData(finalData)
      await submitForm(finalData)
      setCurrentStep(prev => prev + 1)
    }
    // Paso intermedio → solo avanzar
    else if (currentStep < getTotalSteps()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setErrors({})
    }
  }

  const handleClose = () => {
    posthog.capture('questionnaire-closed', {
      current_step: currentStep,
      total_steps: getTotalSteps(),
      submission_status: submissionStatus
    })
    // Reset completo
    setCurrentStep(1)
    setFormData({
      name: '',
      linkedin: '',
      intention: '',
      role: '',
      roleOther: '',
      experience: '',
      timeCommitment: '',
      timestamp: new Date().toISOString(),
      completedPath: ''
    })
    setSubmissionStatus('idle')
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-[#222222] border border-white/5 rounded-xl">
        {/* Header */}
        <div className="relative border-b border-white/5 px-8 py-6">
          <button
            onClick={handleClose}
            className="absolute right-6 top-6 p-1.5 rounded hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white/40 hover:text-white/60" />
          </button>

          <h2 className="text-xl font-medium text-white mb-1">
            Join Levante Project
          </h2>
          <p className="text-white/40 text-sm">
            Step {currentStep} of {getTotalSteps()}
          </p>

          {/* Barra de progreso */}
          <div className="mt-5 w-full bg-white/5 rounded-full h-1 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        {/* Contenido */}
        <div className="px-8 py-8 min-h-[400px]">
          {/* PASO 1: Información básica */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  Let&apos;s start with the basics
                </h3>
                <p className="text-white/40 text-sm">
                  Tell us a bit about yourself
                </p>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-2 text-red-400/80 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                {errors.linkedin && (
                  <p className="mt-2 text-red-400/80 text-sm">{errors.linkedin}</p>
                )}
              </div>
            </div>
          )}

          {/* PASO 2: Intención */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  How do you want to participate?
                </h3>
                <p className="text-white/40 text-sm">
                  Choose the option that best fits your intention
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setFormData({ ...formData, intention: 'active' })}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    formData.intention === 'active'
                      ? 'border-white/30 bg-white/5'
                      : 'border-white/10 bg-transparent hover:border-white/20'
                  }`}
                >
                  <div className="font-medium text-white mb-1">
                    Actively participate
                  </div>
                  <div className="text-sm text-white/40">
                    I want to contribute with my skills and time
                  </div>
                </button>

                <button
                  onClick={() => setFormData({ ...formData, intention: 'observer' })}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    formData.intention === 'observer'
                      ? 'border-white/30 bg-white/5'
                      : 'border-white/10 bg-transparent hover:border-white/20'
                  }`}
                >
                  <div className="font-medium text-white mb-1">
                    Observe and learn
                  </div>
                  <div className="text-sm text-white/40">
                    I want to follow the project and stay updated
                  </div>
                </button>
              </div>

              {errors.intention && (
                <p className="mt-2 text-red-400/80 text-sm">{errors.intention}</p>
              )}
            </div>
          )}

          {/* PASO 3: Rol (solo para active) */}
          {currentStep === 3 && formData.intention === 'active' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  What&apos;s your role?
                </h3>
                <p className="text-white/40 text-sm">
                  Select the role that best describes your skills
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'marketer', label: 'Marketer' },
                  { value: 'designer', label: 'Designer' },
                  { value: 'frontend', label: 'Frontend Dev' },
                  { value: 'backend', label: 'Backend Dev' },
                  { value: 'devops', label: 'DevOps' },
                  { value: 'other', label: 'Other' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, role: option.value as any })}
                    className={`p-4 rounded-lg border transition-all ${
                      formData.role === option.value
                        ? 'border-white/30 bg-white/5'
                        : 'border-white/10 bg-transparent hover:border-white/20'
                    }`}
                  >
                    <div className="font-medium text-white text-center">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>

              {formData.role === 'other' && (
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Specify your role
                  </label>
                  <input
                    type="text"
                    value={formData.roleOther}
                    onChange={(e) => setFormData({ ...formData, roleOther: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="e.g., Product Manager, Data Scientist"
                  />
                  {errors.roleOther && (
                    <p className="mt-2 text-red-400/80 text-sm">{errors.roleOther}</p>
                  )}
                </div>
              )}

              {errors.role && (
                <p className="mt-2 text-red-400/80 text-sm">{errors.role}</p>
              )}
            </div>
          )}

          {/* PASO 4: Experiencia (solo para active) */}
          {currentStep === 4 && formData.intention === 'active' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  What&apos;s your experience level?
                </h3>
                <p className="text-white/40 text-sm">
                  Help us understand your background in programming
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'beginner', label: 'Beginner', desc: 'Just starting my journey' },
                  { value: 'intermediate', label: 'Intermediate', desc: 'Some experience with projects' },
                  { value: 'advanced', label: 'Advanced', desc: 'Experienced professional' },
                  { value: 'none', label: 'No programming experience', desc: 'New to coding' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, experience: option.value as any })}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      formData.experience === option.value
                        ? 'border-white/30 bg-white/5'
                        : 'border-white/10 bg-transparent hover:border-white/20'
                    }`}
                  >
                    <div className="font-medium text-white mb-1">
                      {option.label}
                    </div>
                    <div className="text-sm text-white/40">
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>

              {errors.experience && (
                <p className="mt-2 text-red-400/80 text-sm">{errors.experience}</p>
              )}
            </div>
          )}

          {/* PASO 5: Compromiso de tiempo (solo para active) */}
          {currentStep === 5 && formData.intention === 'active' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  How much time can you commit?
                </h3>
                <p className="text-white/40 text-sm">
                  Hours per week you can dedicate to the project
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '1-3', label: '1-3 hours' },
                  { value: '4-8', label: '4-8 hours' },
                  { value: '9-15', label: '9-15 hours' },
                  { value: '15+', label: '15+ hours' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, timeCommitment: option.value as any })}
                    className={`p-4 rounded-lg border transition-all ${
                      formData.timeCommitment === option.value
                        ? 'border-white/30 bg-white/5'
                        : 'border-white/10 bg-transparent hover:border-white/20'
                    }`}
                  >
                    <div className="font-medium text-white text-center">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>

              {errors.timeCommitment && (
                <p className="mt-2 text-red-400/80 text-sm">{errors.timeCommitment}</p>
              )}
            </div>
          )}

          {/* PANTALLA FINAL */}
          {currentStep === getTotalSteps() && (
            <div className="space-y-6 text-center py-8">
              <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Welcome to Levante
                </h3>
                <p className="text-white/40 text-sm">
                  {formData.intention === 'observer'
                    ? "We'll keep you updated on the project progress"
                    : "We're excited to have you on the team"}
                </p>
              </div>

              {submissionStatus === 'error' ? (
                <p className="text-red-400/80 text-sm text-center">
                  LinkedIn already registered
                </p>
              ) : submissionStatus !== 'success' && (
                <div className="w-full bg-white/5 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm">Saving your information...</span>
                </div>
              )}

              {submissionStatus === 'success' && (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <p className="text-white/60 text-sm mb-4">
                      Join our Discord community to connect with the team
                    </p>
                    <a
                      href="https://discord.gg/JppqE6e3pG"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-black font-medium px-6 py-3 rounded-full hover:bg-white/90 transition-colors text-sm"
                    >
                      Join Discord
                    </a>
                  </div>

                  <button
                    onClick={handleClose}
                    className="text-white/40 hover:text-white/60 transition-colors text-sm"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer con botones de navegación */}
        {currentStep < getTotalSteps() && (
          <div className="border-t border-white/5 px-8 py-6 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-5 py-2.5 rounded-full border border-white/10 text-white text-sm hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
