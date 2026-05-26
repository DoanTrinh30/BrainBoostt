import { useRouter } from 'expo-router'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { signIn } from '../../services/authService'
import { setCredentials } from '../../redux/slices/authSlice'
import {
    TextField,
    PasswordField,
    DividerWithText,
    ThirdPartyContainer,
    ThirdPartyButton,
    SubmitButton,
    OtherOption,
    Logo,
} from '../../components'
import Toast from 'react-native-toast-message'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LoginScreen() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const mutation = useMutation({
        mutationFn: signIn,
        onSuccess: async (data) => {
            await AsyncStorage.setItem('token', data.token)
            dispatch(setCredentials({ accessToken: data.token }))
            Toast.show({
                type: 'success',
                text1: 'Đăng nhập thành công',
                text2: 'Chào mừng quay lại BrainBoost!',
                position: 'top',
            })
            router.push('/bottom/home')
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Đăng nhập thất bại',
                text2:
                    error.message ||
                    'Có lỗi xảy ra. Vui lòng thử lại.',
                position: 'top',
            })
        },
    })

    const handleLogin = () => {
        if (!email || !password) {
            Toast.show({
                type: 'info',
                text1: 'Thiếu thông tin',
                text2: 'Vui lòng nhập email và mật khẩu.',
                position: 'top',
            })
            return
        }
        mutation.mutate({ email, password })
    }

    const navigateToSignUp = () => router.push('/auth/signup')

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Đăng nhập</Text>

                    <TextField
                        label="Email của bạn"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Nhập email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        isEmail={true}
                    />

                    <PasswordField
                        label="Mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Nhập mật khẩu"
                        isPasswordVisible={isPasswordVisible}
                        togglePasswordVisibility={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                        }
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>
                            Quên mật khẩu?
                        </Text>
                    </TouchableOpacity>

                    <SubmitButton
                        text="Đăng nhập"
                        onPress={handleLogin}
                        style={styles.loginButton}
                        textStyle={styles.loginText}
                    />

                    <OtherOption
                        textContent={'Chưa có tài khoản?'}
                        linkContent={'Đăng ký'}
                        onPress={navigateToSignUp}
                    />

                    <DividerWithText text="Hoặc đăng nhập với" />

                    <ThirdPartyContainer>
                        <ThirdPartyButton iconName="logo-google" size={40}>
                            <Logo logoType="google" size={40} />
                        </ThirdPartyButton>
                        <ThirdPartyButton iconName="logo-facebook" size={40}>
                            <Logo logoType="facebook" size={40} />
                        </ThirdPartyButton>
                    </ThirdPartyContainer>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F7F7F7' },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7F7F7',
        paddingHorizontal: 20,
    },
    content: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 50,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 20,
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginVertical: 15,
    },
    forgotPasswordText: {
        color: '#3D5CFF',
        fontSize: 14,
        fontWeight: '500',
    },
})