package com.maintenance.app.ui.tickets

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.maintenance.app.data.api.RetrofitClient
import com.maintenance.app.data.model.TicketDetailResponse
import com.maintenance.app.databinding.ActivityTicketDetailBinding
import com.maintenance.app.utils.TokenManager
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class TicketDetailActivity : AppCompatActivity() {

    private lateinit var binding: ActivityTicketDetailBinding
    private lateinit var tokenManager: TokenManager
    private var ticketId: Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTicketDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)
        ticketId = intent.getIntExtra("ticket_id", 0)

        if (ticketId == 0) {
            Toast.makeText(this, "Ticket invalide", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        setupListeners()
        loadTicketDetail()
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener {
            finish()
        }
    }

    private fun loadTicketDetail() {
        binding.progressBar.visibility = android.view.View.VISIBLE

        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.getTicketDetail(ticketId)
                if (response.isSuccessful) {
                    response.body()?.let { ticket ->
                        displayTicketDetail(ticket)
                    }
                } else {
                    Toast.makeText(this@TicketDetailActivity, "Erreur de chargement", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@TicketDetailActivity, "Erreur: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                binding.progressBar.visibility = android.view.View.GONE
            }
        }
    }

    private fun displayTicketDetail(ticket: TicketDetailResponse) {
        // Informations principales
        binding.tvEquipment.text = ticket.equipmentName
        binding.tvDescription.text = ticket.description
        binding.tvCreatedBy.text = ticket.userName
        binding.tvCreatedDate.text = formatDate(ticket.createdAt)

        // Priorité
        val priorityText = when (ticket.priority) {
            "high" -> "Haute"
            "medium" -> "Moyenne"
            else -> "Basse"
        }
        val priorityColor = when (ticket.priority) {
            "high" -> android.graphics.Color.parseColor("#EF4444")
            "medium" -> android.graphics.Color.parseColor("#F59E0B")
            else -> android.graphics.Color.parseColor("#10B981")
        }
        binding.tvPriority.text = priorityText
        binding.tvPriority.setTextColor(priorityColor)

        // Statut
        val statusText = when (ticket.status) {
            "open" -> "Ouvert"
            "in_progress" -> "En cours"
            "resolved" -> "Résolu"
            else -> "Fermé"
        }
        val statusColor = when (ticket.status) {
            "open" -> android.graphics.Color.parseColor("#F59E0B")
            "in_progress" -> android.graphics.Color.parseColor("#3B82F6")
            "resolved" -> android.graphics.Color.parseColor("#10B981")
            else -> android.graphics.Color.parseColor("#6B7280")
        }
        binding.tvStatus.text = statusText
        binding.tvStatus.setTextColor(statusColor)

        // Technicien
        if (ticket.technicianName != null) {
            binding.tvTechnician.text = ticket.technicianName
            binding.tvTechnician.visibility = android.view.View.VISIBLE
            binding.tvTechnicianLabel.visibility = android.view.View.VISIBLE
        }

        // Solution (si résolu)
        if (ticket.resolutionComment != null) {
            binding.tvResolution.text = ticket.resolutionComment
            binding.tvResolution.visibility = android.view.View.VISIBLE
            binding.tvResolutionLabel.visibility = android.view.View.VISIBLE
        }

        // Historique des logs
        displayLogs(ticket.logs)
    }

    private fun displayLogs(logs: List<com.maintenance.app.data.model.TicketLog>) {
        if (logs.isEmpty()) {
            binding.tvNoLogs.visibility = android.view.View.VISIBLE
            return
        }

        binding.tvNoLogs.visibility = android.view.View.GONE
        val logsText = StringBuilder()

        logs.forEach { log ->
            val date = formatDate(log.createdAt)
            val actionText = getActionText(log.action, log.oldValue, log.newValue)
            logsText.append("• ${log.userName} - $date\n")
            logsText.append("  $actionText\n\n")
        }

        binding.tvLogs.text = logsText
    }

    private fun getActionText(action: String, oldValue: String?, newValue: String?): String {
        return when (action) {
            "ticket_created" -> "🎫 Ticket créé"
            "status_changed" -> "📝 Statut changé : $oldValue → $newValue"
            "assign_technician" -> "🔧 Technicien assigné : $newValue"
            "add_comment" -> "💬 Commentaire : $newValue"
            "add_resolution" -> "✅ Solution : $newValue"
            else -> "$action : $newValue"
        }
    }

    private fun formatDate(dateString: String): String {
        return try {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            val outputFormat = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault())
            val date = inputFormat.parse(dateString)
            outputFormat.format(date ?: Date())
        } catch (e: Exception) {
            dateString.substring(0, 10)
        }
    }
}