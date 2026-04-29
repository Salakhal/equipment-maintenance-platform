package com.maintenance.app.ui.main

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.maintenance.app.R
import com.maintenance.app.data.api.RetrofitClient
import com.maintenance.app.databinding.ActivityMainBinding
import com.maintenance.app.ui.tickets.TicketsFragment
import com.maintenance.app.utils.TokenManager

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val tokenManager = TokenManager(this)



        if (savedInstanceState == null) {
            supportFragmentManager.beginTransaction()
                .replace(R.id.fragmentContainer, TicketsFragment())
                .commit()
        }
    }
}