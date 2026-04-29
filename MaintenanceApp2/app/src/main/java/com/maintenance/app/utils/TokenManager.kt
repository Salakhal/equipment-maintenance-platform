package com.maintenance.app.utils

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.maintenance.app.data.model.User

class TokenManager(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(Constants.PREF_NAME, Context.MODE_PRIVATE)
    private val gson = Gson()

    fun saveToken(token: String) {
        prefs.edit().putString(Constants.TOKEN_KEY, token).apply()
    }

    fun getToken(): String? {
        return prefs.getString(Constants.TOKEN_KEY, null)
    }

    fun saveUser(user: User) {
        val userJson = gson.toJson(user)
        prefs.edit().putString(Constants.USER_KEY, userJson).apply()
    }

    fun getUser(): User? {
        val userJson = prefs.getString(Constants.USER_KEY, null)
        return if (userJson != null) gson.fromJson(userJson, User::class.java) else null
    }

    fun clear() {
        prefs.edit().clear().apply()
    }

    fun isLoggedIn(): Boolean {
        return getToken() != null
    }
}