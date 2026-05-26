import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
} from 'react-native'
import FormFieldEdit from '../../components/containers/FormFieldEdit'
import { useRouter } from 'expo-router'
import { changePassword } from '../../services/authService'
import Toast from 'react-native-toast-message'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'

const PasswordToggle = ({ show, onToggle }) => (
    <TouchableOpacity onPress={onToggle} style={styles.eyeIcon}>
        <Ionicons name={show ? 'eye-off' : 'eye'} size={20} color="#666" />
    </TouchableOpacity>
)

export default function ChangePassword() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            current_password: '',
            new_password: '',
        },
    })

    const changePasswordMutation = useMutation({
        mutationFn: ({ current_password, new_password }) =>
            changePassword(current_password, new_password),
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Đổi mật khẩu thành công!',
                position: 'top',
            })
            router.back()
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Đổi mật khẩu thất bại',
                text2:
                    error.message ||
                    'Không thể đổi mật khẩu. Vui lòng thử lại sau.',
                position: 'top',
            })
        },
    })

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev)
    }

    const onSubmit = (data) => {
        changePasswordMutation.mutate(data)
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Icon name="arrow-left" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
                    <TouchableOpacity
                        onPress={handleSubmit(onSubmit)}
                        disabled={changePasswordMutation.isPending}
                    >
                        {changePasswordMutation.isPending ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : (
                            <Icon name="check" size={24} color="#000" />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.formContainer}>
                    <Controller
                        control={control}
                        name="current_password"
                        rules={{
                            required: 'Vui lòng nhập mật khẩu hiện tại',
                        }}
                        render={({ field: { onChange, value } }) => (
                            <FormFieldEdit
                                label="Mật khẩu hiện tại"
                                name="current_password"
                                type={showPassword ? 'text' : 'password'}
                                value={value}
                                onChange={(_, value) => onChange(value)}
                                suffix={
                                    <PasswordToggle
                                        show={showPassword}
                                        onToggle={togglePasswordVisibility}
                                    />
                                }
                            />
                        )}
                    />
                    {errors.current_password && (
                        <Text style={styles.errorMessage}>
                            {errors.current_password.message}
                        </Text>
                    )}

                    <Controller
                        control={control}
                        name="new_password"
                        rules={{
                            required: 'Vui lòng nhập mật khẩu mới',
                            pattern: {
                                value: /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/,
                                message:
                                    'Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 số và 1 ký tự đặc biệt.',
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <FormFieldEdit
                                label="Mật khẩu mới"
                                name="new_password"
                                type={showPassword ? 'text' : 'password'}
                                value={value}
                                onChange={(_, value) => onChange(value)}
                                suffix={
                                    <PasswordToggle
                                        show={showPassword}
                                        onToggle={togglePasswordVisibility}
                                    />
                                }
                            />
                        )}
                    />
                    {errors.new_password && (
                        <Text style={styles.errorMessage}>
                            {errors.new_password.message}
                        </Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
        paddingTop: 0,
        paddingBottom: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    formContainer: {
        width: '100%',
        marginTop: 20,
    },
    eyeIcon: {
        padding: 5,
    },
    errorMessage: {
        color: '#ff4d4f',
        fontSize: 12,
        marginTop: -15,
        marginBottom: 15,
        marginLeft: 5,
    },
})