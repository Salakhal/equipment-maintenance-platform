package com.maintenance.app.ui.tickets

import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.maintenance.app.data.api.RetrofitClient
import com.maintenance.app.data.model.CreateTicketRequest
import com.maintenance.app.data.model.Equipment
import com.maintenance.app.databinding.ActivityCreateTicketBinding
import com.maintenance.app.utils.TokenManager
import kotlinx.coroutines.launch

class CreateTicketActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCreateTicketBinding
    private lateinit var tokenManager: TokenManager
    private var selectedEquipmentId: Int? = null
    private var equipments: List<Equipment> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCreateTicketBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        setupListeners()
        loadEquipments()
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener {
            finish()
        }

        binding.btnSubmit.setOnClickListener {
            submitTicket()
        }
    }

    private fun loadEquipments() {
        binding.progressBar.visibility = android.view.View.VISIBLE

        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.getEquipments()
                if (response.isSuccessful) {
                    equipments = response.body() ?: emptyList()
                    setupEquipmentSpinner()
                } else {
                    Toast.makeText(this@CreateTicketActivity, "Erreur de chargement des équipements", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@CreateTicketActivity, "Erreur: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                binding.progressBar.visibility = android.view.View.GONE
            }
        }
    }

    private fun setupEquipmentSpinner() {
        val equipmentNames = equipments.map { "${it.name} - ${it.room}" }
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, equipmentNames)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spinnerEquipment.adapter = adapter

        binding.spinnerEquipment.setOnItemSelectedListener(object : android.widget.AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: android.widget.AdapterView<*>?, view: android.view.View?, position: Int, id: Long) {
                selectedEquipmentId = equipments[position].id
            }

            override fun onNothingSelected(parent: android.widget.AdapterView<*>?) {
                selectedEquipmentId = null
            }
        })
    }

    private fun submitTicket() {
        val description = binding.etDescription.text.toString().trim()
        val priority = when (binding.radioPriority.checkedRadioButtonId) {
            binding.rbLow.id -> "low"
            binding.rbMedium.id -> "medium"
            binding.rbHigh.id -> "high"
            else -> "medium"
        }

        if (selectedEquipmentId == null) {
            Toast.makeText(this, "Veuillez sélectionner un équipement", Toast.LENGTH_SHORT).show()
            return
        }

        if (description.isEmpty()) {
            Toast.makeText(this, "Veuillez décrire la panne", Toast.LENGTH_SHORT).show()
            return
        }

        binding.btnSubmit.isEnabled = false
        binding.progressBar.visibility = android.view.View.VISIBLE

        lifecycleScope.launch {
            try {
                val request = CreateTicketRequest(
                    equipmentId = selectedEquipmentId!!,
                    description = description,
                    priority = priority,
                    photoUrl = null
                )

                val response = RetrofitClient.apiService.createTicket(request)
                if (response.isSuccessful && response.body()?.success == true) {
                    Toast.makeText(this@CreateTicketActivity, "Ticket créé avec succès !", Toast.LENGTH_LONG).show()
                    finish()
                } else {
                    Toast.makeText(this@CreateTicketActivity, "Erreur lors de la création", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@CreateTicketActivity, "Erreur: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                binding.btnSubmit.isEnabled = true
                binding.progressBar.visibility = android.view.View.GONE
            }
        }
    }
}