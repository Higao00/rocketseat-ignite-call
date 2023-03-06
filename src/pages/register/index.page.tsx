import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import * as S from './styles'
import { ArrowRight } from "phosphor-react"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios';

const registerFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: "O usuário precisa ter pelo menos 3 letras." })
        .regex(/^([a-z\\-]+)$/i, { message: "O usuário pode ter apenas letras e hifens." })
        .transform(username => username.toLowerCase()),
    name: z
        .string()
        .min(3, { message: "O nome precisa ter pelo menos 3 letras." })
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema)
    })

    const router = useRouter()

    useEffect(() => {
        if (router.query.username) {
            setValue('username', String(router.query.username))
        }
    }, [router.query?.username, setValue])

    async function handleRegister(data: RegisterFormData) {
        try {
            await api.post('/users', {
                name: data.name,
                username: data.username
            })
        } catch (error) {
            if (error instanceof AxiosError && error?.response?.data?.message) {
                alert(error.response.data.message)
                return
            }

            console.log(error)
        }
    }

    return (
        <S.Container>
            <S.Header>
                <Heading as="strong">
                    Bem-vindo ao Ignite Call!
                </Heading>
                <Text>
                    Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
                </Text>

                <MultiStep size={4} currentStep={1} />
            </S.Header>

            <S.Form as="form" onSubmit={handleSubmit(handleRegister)}>
                <label>
                    <Text size="sm">Nome de usuário</Text>
                    <TextInput prefix='ignite.com/' placeholder='seu-usuario' {...register('username')} />
                    {errors.username && (
                        <S.FormError size="sm">
                            {errors.username.message}
                        </S.FormError>
                    )}
                </label>

                <label>
                    <Text size="sm">Nome completo</Text>
                    <TextInput placeholder='Seu nome' {...register('name')} />
                    {errors.name && (
                        <S.FormError size="sm">
                            {errors.name.message}
                        </S.FormError>
                    )}
                </label>

                <Button type='submit' disabled={isSubmitting}>
                    Próximo passo <ArrowRight />
                </Button>
            </S.Form>
        </S.Container>
    )
} 