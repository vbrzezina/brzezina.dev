'use client'

import { useId, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useTranslations } from 'next-intl'
import { Container, Section } from '@/components/layout'
import { Reveal } from '@/components/Reveal'
import { Button, Icon, SectionHeader } from '@/components/ui'
import { hasLegalIdentity, legal, site } from '@/data/site'
import { Link } from '@/i18n/navigation'
import { type } from '@/styles/typography'

type FieldName = 'name' | 'email' | 'message'
type Values = Record<FieldName, string>
type Errors = Partial<Record<FieldName, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: Values): Partial<Record<FieldName, true>> {
  const invalid: Partial<Record<FieldName, true>> = {}
  if (!values.name.trim()) invalid.name = true
  if (!EMAIL_PATTERN.test(values.email.trim())) invalid.email = true
  if (!values.message.trim()) invalid.message = true
  return invalid
}

// ─── Layout ───────────────────────────────────────────────────────────────────

const Layout = styled.div`
  display: grid;
  gap: 2rem;
  margin-top: clamp(3rem, 2rem + 3vw, 4.5rem);

  ${({ theme }) => theme.mq.lg} {
    grid-template-columns: 8fr 4fr;
    gap: 3rem;
    align-items: start;
  }
`

const Panel = styled.div`
  padding: clamp(1.25rem, 1rem + 1.5vw, 2rem);
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`

const Form = styled.form`
  display: grid;
  gap: 1.5rem;

  ${({ theme }) => theme.mq.sm} {
    grid-template-columns: 1fr 1fr;
  }
`

// ─── Field ────────────────────────────────────────────────────────────────────

const FieldRoot = styled.div<{ $wide?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  ${({ theme }) => theme.mq.sm} {
    grid-column: ${({ $wide }) => ($wide ? '1 / -1' : 'auto')};
  }
`

const Label = styled.label`
  ${type.label}
  color: ${({ theme }) => theme.colors.fg};
`

/* Visual marker only — the inputs carry `required`, so assistive tech announces it already. */
const RequiredMark = styled.span`
  margin-left: 0.25rem;
  color: ${({ theme }) => theme.colors.accent};
`

const controlStyles = ({ theme }: { theme: import('@emotion/react').Theme }) => `
  width: 100%;
  min-height: 3rem;
  padding: 0.75rem 0.875rem;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.colors.borderStrong};
  background: ${theme.colors.band};
  color: ${theme.colors.fg};
  font-family: ${theme.fonts.sans};
  font-size: 1.0625rem;
  line-height: 1.5;
  transition: border-color ${theme.motion.fast} ease, box-shadow ${theme.motion.fast} ease;

  &::placeholder {
    color: ${theme.colors.fgTertiary};
    opacity: 1;
  }

  &:hover {
    border-color: ${theme.colors.fgTertiary};
  }

  &:focus-visible {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px ${theme.colors.accentSubtle};
  }

  &[aria-invalid='true'] {
    border-color: ${theme.colors.error};
  }

  /* An invalid field keeps its error colour while focused — the halo turns red too. */
  &[aria-invalid='true']:focus-visible {
    border-color: ${theme.colors.error};
    box-shadow: 0 0 0 3px ${theme.colors.errorSubtle};
  }
`

const Input = styled.input`
  ${controlStyles}
`

const Textarea = styled.textarea`
  ${controlStyles}
  resize: vertical;
  min-height: 11rem;
`

const ErrorText = styled.p`
  ${type.bodyS}
  color: ${({ theme }) => theme.colors.error};
`

const SubmitError = styled.p`
  ${type.bodyS}
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.fg};

  ${({ theme }) => theme.mq.sm} {
    grid-column: 1 / -1;
  }

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
`

const FormFooter = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 1rem;

  ${({ theme }) => theme.mq.sm} {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const Hint = styled.p`
  ${type.bodyS}
  color: ${({ theme }) => theme.colors.fgTertiary};

  a {
    color: ${({ theme }) => theme.colors.fgSecondary};
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
`

// ─── Success state ────────────────────────────────────────────────────────────

const Success = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding-block: 2rem;
  outline: none;
`

const SuccessIcon = styled.span`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentSubtle};
  color: ${({ theme }) => theme.colors.success};
`

const SuccessTitle = styled.h3`
  ${type.titleL}
  color: ${({ theme }) => theme.colors.fg};
  margin-top: 0.5rem;
`

const SuccessBody = styled.p`
  ${type.bodyM}
  color: ${({ theme }) => theme.colors.fgSecondary};
  margin-bottom: 0.75rem;
`

// ─── Aside ────────────────────────────────────────────────────────────────────

const Aside = styled.dl`
  display: grid;
  gap: 1.75rem;
  align-content: start;

  ${({ theme }) => theme.mq.sm} {
    grid-template-columns: 1fr 1fr;
  }

  ${({ theme }) => theme.mq.lg} {
    grid-template-columns: 1fr;
    padding-top: 0.5rem;
  }

  dt {
    ${type.monoEyebrow}
    color: ${({ theme }) => theme.colors.fgTertiary};
    margin-bottom: 0.5rem;
  }

  dd {
    ${type.bodyM}
    color: ${({ theme }) => theme.colors.fg};
  }
`

const AsideLink = styled.a`
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  /* Full-size touch target, but the text sits on the same baseline rhythm as the plain values. */
  margin-block: -0.5rem;
  color: ${({ theme }) => theme.colors.fg};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.colors.borderStrong};
  text-underline-offset: 0.25em;
  transition:
    color ${({ theme }) => theme.motion.fast} ease,
    text-decoration-color ${({ theme }) => theme.motion.fast} ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration-color: currentColor;
  }
`

const BusinessDetails = styled.dd`
  && {
    ${type.bodyS}
    color: ${({ theme }) => theme.colors.fgSecondary};
  }

  span {
    display: block;
  }
`

// ─── Component ────────────────────────────────────────────────────────────────

export function Contact() {
  const t = useTranslations('contact')
  const uid = useId()
  const [values, setValues] = useState<Values>({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const successRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const invalid = validate(values)
  // Validate on blur first, then live — never shout at someone mid-typing.
  const errors: Errors = {}
  for (const field of ['name', 'email', 'message'] as const) {
    if (touched[field] && invalid[field]) errors[field] = t(`form.errors.${field}`)
  }

  function update(field: FieldName) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function blur(field: FieldName) {
    return () => setTouched((prev) => ({ ...prev, [field]: true }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })

    const firstInvalid = (['name', 'email', 'message'] as const).find((f) => invalid[f])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(site.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      })
      if (!res.ok) throw new Error(`Contact endpoint responded ${res.status}`)
      setStatus('success')
      requestAnimationFrame(() => successRef.current?.focus())
    } catch {
      // Never claim success we can't confirm; the typed message stays in the form.
      setStatus('error')
    }
  }

  function reset() {
    setValues({ name: '', email: '', message: '' })
    setTouched({})
    setStatus('idle')
  }

  const fieldProps = (field: FieldName) => ({
    id: `${uid}-${field}`,
    name: field,
    value: values[field],
    onChange: update(field),
    onBlur: blur(field),
    required: true,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${uid}-${field}-error` : undefined,
    placeholder: t(`form.${field}Placeholder`),
  })

  return (
    <Section id="contact" aria-labelledby="contact-title">
      <Container>
        <Reveal>
          <SectionHeader
            index={t('index')}
            label={t('slug')}
            title={t('heading')}
            titleId="contact-title"
            lead={t('lead')}
          />
        </Reveal>

        <Layout>
          <Reveal delay={80}>
            <Panel>
              {status === 'success' ? (
                <Success ref={successRef} tabIndex={-1} role="status">
                  <SuccessIcon>
                    <Icon name="check" size={22} />
                  </SuccessIcon>
                  <SuccessTitle>{t('form.successTitle')}</SuccessTitle>
                  <SuccessBody>{t('form.successBody')}</SuccessBody>
                  <Button $variant="secondary" type="button" onClick={reset}>
                    {t('form.sendAnother')}
                  </Button>
                </Success>
              ) : (
                <Form ref={formRef} onSubmit={handleSubmit} noValidate aria-label={t('form.label')}>
                  <FieldRoot>
                    <Label htmlFor={`${uid}-name`}>
                      {t('form.name')}
                      <RequiredMark aria-hidden="true">*</RequiredMark>
                    </Label>
                    <Input type="text" autoComplete="name" {...fieldProps('name')} />
                    {errors.name && <ErrorText id={`${uid}-name-error`}>{errors.name}</ErrorText>}
                  </FieldRoot>

                  <FieldRoot>
                    <Label htmlFor={`${uid}-email`}>
                      {t('form.email')}
                      <RequiredMark aria-hidden="true">*</RequiredMark>
                    </Label>
                    <Input type="email" autoComplete="email" inputMode="email" {...fieldProps('email')} />
                    {errors.email && <ErrorText id={`${uid}-email-error`}>{errors.email}</ErrorText>}
                  </FieldRoot>

                  <FieldRoot $wide>
                    <Label htmlFor={`${uid}-message`}>
                      {t('form.message')}
                      <RequiredMark aria-hidden="true">*</RequiredMark>
                    </Label>
                    <Textarea rows={7} {...fieldProps('message')} />
                    {errors.message && <ErrorText id={`${uid}-message-error`}>{errors.message}</ErrorText>}
                  </FieldRoot>

                  {status === 'error' && (
                    <SubmitError role="alert">
                      {t.rich('form.error', {
                        link: (chunks) => (
                          <a href={site.githubUrl} target="_blank" rel="noopener noreferrer">
                            {chunks}
                          </a>
                        ),
                      })}
                    </SubmitError>
                  )}

                  <FormFooter>
                    <Hint>
                      {t.rich('form.privacy', {
                        link: (chunks) => <Link href="/privacy">{chunks}</Link>,
                      })}
                    </Hint>
                    <Button type="submit" disabled={status === 'sending'}>
                      {status === 'sending' ? t('form.sending') : t('form.submit')}
                      {status !== 'sending' && <Icon name="arrowRight" size={18} data-nudge />}
                    </Button>
                  </FormFooter>
                </Form>
              )}
            </Panel>
          </Reveal>

          <Reveal delay={160}>
            <Aside>
              <div>
                <dt>{t('sidebar.emailLabel')}</dt>
                <dd>
                  <AsideLink href={`mailto:${site.contactEmail}`}>{site.contactEmail}</AsideLink>
                </dd>
              </div>
              <div>
                <dt>{t('sidebar.phoneLabel')}</dt>
                <dd>
                  <AsideLink href={site.phoneHref}>{site.phone}</AsideLink>
                </dd>
              </div>
              <div>
                <dt>{t('sidebar.responseLabel')}</dt>
                <dd>{t('sidebar.responseValue')}</dd>
              </div>
              <div>
                <dt>{t('sidebar.basedLabel')}</dt>
                <dd>{t('sidebar.basedValue')}</dd>
              </div>
              <div>
                <dt>{t('sidebar.cvLabel')}</dt>
                <dd>
                  <Button $variant="secondary" asChild>
                    <a href={site.cvUrl} download>
                      {t('sidebar.cvCta')}
                      <Icon name="download" size={16} />
                    </a>
                  </Button>
                </dd>
              </div>
              {hasLegalIdentity && (
                <div>
                  <dt>{t('sidebar.businessLabel')}</dt>
                  <BusinessDetails>
                    <span>{legal.name}</span>
                    <span>{t('sidebar.ico', { ico: legal.ico })}</span>
                    <span>{legal.address}</span>
                  </BusinessDetails>
                </div>
              )}
            </Aside>
          </Reveal>
        </Layout>
      </Container>
    </Section>
  )
}
