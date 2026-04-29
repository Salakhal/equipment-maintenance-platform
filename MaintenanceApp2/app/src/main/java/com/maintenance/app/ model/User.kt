package com.maintenance.app.data.model

import com.google.gson.annotations.SerializedName

data class User(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String,
    @SerializedName("email") val email: String,
    @SerializedName("role") val role: String,
    @SerializedName("created_at") val createdAt: String?
)

data class LoginRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String
)

data class LoginResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("token") val token: String,
    @SerializedName("user") val user: User
)
// Pour Mot de passe oublié
data class ForgotPasswordRequest(
    @SerializedName("email") val email: String
)

data class ForgotPasswordResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String,
    @SerializedName("resetLink") val resetLink: String? = null
)

// Pour Réinitialisation du mot de passe
data class ResetPasswordRequest(
    @SerializedName("token") val token: String,
    @SerializedName("password") val password: String,
    @SerializedName("confirmPassword") val confirmPassword: String
)