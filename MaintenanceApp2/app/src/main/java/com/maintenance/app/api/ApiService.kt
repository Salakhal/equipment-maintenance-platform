package com.maintenance.app.data.api

import com.maintenance.app.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // ==============================================
    // AUTHENTIFICATION
    // ==============================================

    // Connexion
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    // ⭐ Mot de passe oublié
    @POST("auth/forgot-password")
    suspend fun forgotPassword(@Body request: ForgotPasswordRequest): Response<ForgotPasswordResponse>

    // ⭐ Réinitialisation du mot de passe
    @POST("auth/reset-password")
    suspend fun resetPassword(@Body request: ResetPasswordRequest): Response<ApiResponse>

    // ==============================================
    // ÉQUIPEMENTS
    // ==============================================

    @GET("equipments")
    suspend fun getEquipments(): Response<List<Equipment>>

    // ==============================================
    // TICKETS
    // ==============================================

    @GET("tickets")
    suspend fun getTickets(): Response<List<Ticket>>

    @GET("tickets/{id}")
    suspend fun getTicketDetail(@Path("id") id: Int): Response<TicketDetailResponse>

    @POST("tickets")
    suspend fun createTicket(@Body request: CreateTicketRequest): Response<ApiResponse>

    @PATCH("tickets/{id}/status")
    suspend fun updateTicketStatus(
        @Path("id") id: Int,
        @Body request: Map<String, String>
    ): Response<ApiResponse>

    @POST("tickets/{id}/comments")
    suspend fun addComment(
        @Path("id") id: Int,
        @Body request: Map<String, String>
    ): Response<ApiResponse>
}