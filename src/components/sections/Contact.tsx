'use client'

import { useState } from 'react'
import styled from '@emotion/styled'
import * as Label from '@radix-ui/react-label'
import { useTranslations } from 'next-intl'
import { Container, Box, Spacer } from '@/components/layout'
import { Button } from '@/components/ui'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'

// ─── Layout ───────────────────────────────────────────────────────────────────

const ContactSection = styled.section``

const TwoColGrid = styled.div`
  display: grid;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: start;
  }
`

// ─── Form elements ────────────────────────────────────────────────────────────

const StyledLabel = styled(Label.Root)`
  display: block;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin-bottom: 0.5rem;
`

const inputBase = ({ theme }: { theme: import('@/app/theme').AppTheme }) => `
  width: 100%;
  background: ${theme.colors.input};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.25rem;
  padding: 0.75rem 1rem;
  font-family: ${theme.fonts.sans};
  font-size: 1rem;
  color: ${theme.colors.foreground};
  outline: none;
  transition: border-color 200ms;
  box-sizing: border-box;

  &::placeholder {
    color: ${theme.colors.mutedForeground}80;
  }

  &:hover {
    border-color: ${theme.colors.mutedForeground};
  }

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &:focus-visible {
    outline: 1px solid ${theme.colors.ring};
    outline-offset: 0;
  }
`

const StyledInput = styled.input`
  ${({ theme }) => inputBase({ theme })}
`

const StyledTextarea = styled.textarea`
  ${({ theme }) => inputBase({ theme })}
  resize: vertical;
  min-height: 8rem;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`

const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const StatusMessage = styled.p<{ $isError?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 0.9375rem;
  color: ${({ theme, $isError }) =>
    $isError ? theme.colors.destructive : theme.colors.primary};
  margin-top: 1rem;
  margin-bottom: 0;
`

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar = styled.aside`
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const SidebarBlock = styled.div``

const SidebarLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.mutedForeground};
  margin: 0 0 0.5rem;
`

const SidebarValue = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.foreground};
  margin: 0;
`

// ─── Component ────────────────────────────────────────────────────────────────

export function Contact() {
  const t = useTranslations('contact')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setStatus('success')
    }, 1000)
  }

  return (
    <ContactSection id="contact">
      <Container>
        <Box $py={24}>
          <SectionHeading
            index={t('index')}
            slug={t('slug')}
            title={t('heading')}
            lead={t('lead')}
          />
          <Spacer $size={12} />

          <TwoColGrid>
            <Reveal delay={0}>
              <form onSubmit={handleSubmit} noValidate>
                <FormStack>
                  <FormGrid>
                    <FieldGroup>
                      <StyledLabel htmlFor="contact-name">
                        {t('form.name')}
                      </StyledLabel>
                      <StyledInput
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder={t('form.name')}
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <StyledLabel htmlFor="contact-email">
                        {t('form.email')}
                      </StyledLabel>
                      <StyledInput
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder={t('form.email')}
                      />
                    </FieldGroup>
                  </FormGrid>

                  <FieldGroup>
                    <StyledLabel htmlFor="contact-message">
                      {t('form.message')}
                    </StyledLabel>
                    <StyledTextarea
                      id="contact-message"
                      name="message"
                      required
                      placeholder={t('form.message')}
                    />
                  </FieldGroup>

                  <Button
                    type="submit"
                    disabled={sending}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    {sending ? t('form.sending') : t('form.submit')}
                  </Button>
                </FormStack>

                {status === 'success' && (
                  <StatusMessage>{t('form.success')}</StatusMessage>
                )}
                {status === 'error' && (
                  <StatusMessage $isError>{t('form.error')}</StatusMessage>
                )}
              </form>
            </Reveal>

            <Reveal delay={100}>
              <Sidebar>
                <SidebarBlock>
                  <SidebarLabel>{t('sidebar.responseLabel')}</SidebarLabel>
                  <SidebarValue>{t('sidebar.responseValue')}</SidebarValue>
                </SidebarBlock>

                <SidebarBlock>
                  <SidebarLabel>{t('sidebar.cvLabel')}</SidebarLabel>
                  <Button $variant="outline" asChild style={{ marginTop: '0.5rem' }}>
                    <a href="/cv.pdf" download>
                      {t('sidebar.cvCta')}
                    </a>
                  </Button>
                </SidebarBlock>
              </Sidebar>
            </Reveal>
          </TwoColGrid>
        </Box>
      </Container>
    </ContactSection>
  )
}
