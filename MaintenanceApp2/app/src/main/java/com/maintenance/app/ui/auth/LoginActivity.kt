package com.maintenance.app.ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import android.view.View
import com.maintenance.app.data.api.RetrofitClient
import com.maintenance.app.data.model.LoginRequest
import com.maintenance.app.databinding.ActivityLoginBinding
import com.maintenance.app.ui.main.MainActivity
import com.maintenance.app.utils.TokenManager
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        // Vérifier si déjà connecté
        if (tokenManager.isLoggedIn()) {
            tokenManager.clear()
        }

        setupListeners()
    }

    private fun setupListeners() {
        // Bouton Connexion
        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                showError("Veuillez remplir tous les champs")
                return@setOnClickListener
            }

            login(email, password)
        }

        // Mot de passe oublié
        binding.tvForgotPassword.setOnClickListener {
            Toast.makeText(
                this,
                "Contactez l'administrateur pour réinitialiser votre mot de passe",
                Toast.LENGTH_LONG
            ).show()
        }
    }

    private fun login(email: String, password: String) {
        // Animation du bouton
        binding.btnLogin.animate()
            .scaleX(0.95f)
            .scaleY(0.95f)
            .setDuration(100)
            .withEndAction {
                binding.btnLogin.animate().scaleX(1f).scaleY(1f).setDuration(100).start()
            }
            .start()

        // État de chargement
        binding.btnLogin.isEnabled = false
        binding.progressBar.visibility = View.VISIBLE
        hideError()

        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.login(LoginRequest(email, password))

                if (response.isSuccessful && response.body()?.success == true) {
                    val loginResponse = response.body()!!
                    tokenManager.saveToken(loginResponse.token)
                    tokenManager.saveUser(loginResponse.user)

                    // Initialiser RetrofitClient avec le token
                    RetrofitClient.initialize(tokenManager)

                    Toast.makeText(this@LoginActivity, "Connexion réussie !", Toast.LENGTH_SHORT).show()
                    navigateToMain()
                } else {
                    showError("Email ou mot de passe incorrect")
                }
            } catch (e: Exception) {
                showError("Erreur de connexion: ${e.message}")
            } finally {
                binding.btnLogin.isEnabled = true
                binding.progressBar.visibility = View.GONE
            }
        }
    }

    private fun navigateToMain() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }

    private fun showError(message: String) {
        binding.tvError.text = message
        binding.tvError.visibility = View.VISIBLE
    }

    private fun hideError() {
        binding.tvError.visibility = View.GONE
    }
}