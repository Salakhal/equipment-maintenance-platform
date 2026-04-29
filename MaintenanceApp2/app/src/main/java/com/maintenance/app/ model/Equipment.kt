package com.maintenance.app.data.model

import com.google.gson.annotations.SerializedName

data class Equipment(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String,
    @SerializedName("room") val room: String,
    @SerializedName("type") val type: String,
    @SerializedName("status") val status: String,
    @SerializedName("created_at") val createdAt: String?
)