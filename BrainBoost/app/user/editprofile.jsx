import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
} from 'react-native'
import FormFieldEdit from '../../components/containers/FormFieldEdit'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import Toast from 'react-native-toast-message'
import {
    getProfile,
    updateProfile,
    updateAvatar,
} from '../../services/profileService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { format, set } from 'date-fns'

export default function EditProfile() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [isDatePickerVisible, setDatePickerVisible] = useState(false)

    const {
        data: userData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
    })

    const {
        control,
        handleSubmit,
        setValue,
        formState: { isDirty, errors },
    } = useForm({
        defaultValues: {
            username: userData?.username || '',
            email: userData?.email || '',
            dob: userData?.dob || '',
        },
    })

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                text2: 'Your profile has been updated successfully!',
                position: 'top',
            })
            router.replace('/bottom/profile')
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Update Error',
                text2:
                    error.message ||
                    'Failed to update profile. Please try again.',
                position: 'top',
            })
        },
    })

    const updateAvatarMutation = useMutation({
        mutationFn: updateAvatar,
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            Toast.show({
                type: 'success',
                text1: 'Avatar Updated',
                text2: 'Your avatar has been updated successfully!',
                position: 'top',
            })
            router.replace('/bottom/profile')
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Avatar Update Error',
                text2:
                    error.message ||
                    'Failed to update avatar. Please try again.',
                position: 'top',
            })
        },
    })

    const handleUpdateProfile = (data) => {
        updateProfileMutation.mutate(data)
    }

    const handleUpdateAvatar = async () => {
        try {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (status !== 'granted') {
                Toast.show({
                    type: 'error',
                    text1: 'Permission Denied',
                    text2: 'Permission to access media library is required.',
                    position: 'top',
                })
                return
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: true,
                aspect: [1, 1],
            })

            if (result.canceled) {
                return
            }

            const imageUri = result.assets[0].uri
            updateAvatarMutation.mutate(imageUri)
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Avatar Selection Error',
                text2: 'An error occurred while selecting the image.',
                position: 'top',
            })
        }
    }

    const handleConfirmDate = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd')
        setValue('dob', formattedDate, { shouldDirty: true })
        setDatePickerVisible(false)
    }

    if (
        isLoading ||
        updateProfileMutation.isPending ||
        updateAvatarMutation.isPending
    ) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </SafeAreaView>
        )
    }

    if (isError) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        Error: {error?.message || 'Failed to load profile'}
                    </Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() =>
                            queryClient.invalidateQueries({
                                queryKey: ['profile'],
                            })
                        }
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Icon name="arrow-left" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity
                        onPress={handleSubmit(handleUpdateProfile)}
                    >
                        <Icon name="check" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: userData.avatar_url }}
                        style={styles.profileImage}
                    />
                    <TouchableOpacity
                        style={styles.cameraButton}
                        onPress={handleUpdateAvatar}
                    >
                        <Ionicons name="camera" size={16} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.formContainer}>
                    <Controller
                        control={control}
                        name="username"
                        rules={{ required: 'Username is required' }}
                        render={({ field: { onChange, value } }) => (
                            <FormFieldEdit
                                label="User name"
                                name="username"
                                value={value}
                                onChange={(_, value) => onChange(value)}
                            />
                        )}
                    />
                    {errors.username && (
                        <Text style={styles.errorMessage}>
                            {errors.username.message}
                        </Text>
                    )}

                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <FormFieldEdit
                                label="Email address"
                                name="email"
                                type="email"
                                value={value}
                                onChange={(_, value) => onChange(value)}
                                prefix="@"
                            />
                        )}
                    />
                    {errors.email && (
                        <Text style={styles.errorMessage}>
                            {errors.email.message}
                        </Text>
                    )}

                    <Controller
                        control={control}
                        name="dob"
                        render={({ field: { value } }) => (
                            <TouchableOpacity
                                onPress={() => setDatePickerVisible(true)}
                            >
                                <View pointerEvents="none">
                                    <FormFieldEdit
                                        label="Date of birth"
                                        name="dob"
                                        value={value}
                                        onChange={() => {}}
                                        suffix={
                                            <View style={styles.calendarIcon}>
                                                <Ionicons
                                                    name="calendar"
                                                    size={20}
                                                    color="#666"
                                                />
                                            </View>
                                        }
                                    />
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                    {/* Date Picker Modal */}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmDate}
                        onCancel={() => setDatePickerVisible(false)}
                        maximumDate={new Date()}
                        display="spinner"
                    />
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
        backgroundColor: '#fff',
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
    profileImageContainer: {
        alignSelf: 'center',
        marginBottom: 30,
        position: 'relative',
    },
    profileImage: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 2,
        borderColor: '#e8e8e8',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1890ff',
        borderRadius: 12,
        padding: 4,
    },
    formContainer: {
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#ff4d4f',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#1890ff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    errorMessage: {
        color: '#ff4d4f',
        fontSize: 12,
        marginTop: -15,
        marginBottom: 15,
        marginLeft: 5,
    },
    calendarIcon: {
        padding: 5,
    },
})
