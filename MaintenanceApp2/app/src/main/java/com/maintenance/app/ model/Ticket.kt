package com.maintenance.app.data.model

import com.google.gson.annotations.SerializedName

data class Ticket(
    @SerializedName("id") val id: Int,
    @SerializedName("equipment_id") val equipmentId: Int,
    @SerializedName("equipment_name") val equipmentName: String,
    @SerializedName("description") val description: String,
    @SerializedName("priority") val priority: String,
    @SerializedName("status") val status: String,
    @SerializedName("photo_url") val photoUrl: String?,
    @SerializedName("created_at") val createdAt: String,
    @SerializedName("user_name") val userName: String,
    @SerializedName("technician_name") val technicianName: String?
)

data class CreateTicketRequest(
    @SerializedName("equipment_id") val equipmentId: Int,
    @SerializedName("description") val description: String,
    @SerializedName("priority") val priority: String,
    @SerializedName("photo_url") val photoUrl: String? = null
)

data class TicketDetailResponse(
    @SerializedName("id") val id: Int,
    @SerializedName("equipment_name") val equipmentName: String,
    @SerializedName("description") val description: String,
    @SerializedName("priority") val priority: String,
    @SerializedName("status") val status: String,
    @SerializedName("photo_url") val photoUrl: String?,
    @SerializedName("created_at") val createdAt: String,
    @SerializedName("user_name") val userName: String,
    @SerializedName("technician_name") val technicianName: String?,
    @SerializedName("resolution_comment") val resolutionComment: String?,
    @SerializedName("logs") val logs: List<TicketLog>
)