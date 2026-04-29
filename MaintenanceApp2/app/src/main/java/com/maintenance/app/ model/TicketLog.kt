package com.maintenance.app.data.model

import com.google.gson.annotations.SerializedName

data class TicketLog(
    @SerializedName("id") val id: Int,
    @SerializedName("action") val action: String,
    @SerializedName("old_value") val oldValue: String?,
    @SerializedName("new_value") val newValue: String?,
    @SerializedName("created_at") val createdAt: String,
    @SerializedName("user_name") val userName: String
)