package com.maintenance.app.ui.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.maintenance.app.data.model.Ticket
import com.maintenance.app.databinding.ItemTicketBinding

class TicketAdapter(
    private val onItemClick: (Int) -> Unit
) : RecyclerView.Adapter<TicketAdapter.TicketViewHolder>() {

    private var tickets: List<Ticket> = emptyList()

    fun submitList(list: List<Ticket>) {
        tickets = list
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TicketViewHolder {
        val binding = ItemTicketBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return TicketViewHolder(binding)
    }

    override fun onBindViewHolder(holder: TicketViewHolder, position: Int) {
        holder.bind(tickets[position])
        holder.itemView.setOnClickListener {
            onItemClick(tickets[position].id)
        }
    }

    override fun getItemCount() = tickets.size

    class TicketViewHolder(private val binding: ItemTicketBinding) : RecyclerView.ViewHolder(binding.root) {


        fun bind(ticket: Ticket) {
            binding.tvDescription.text = ticket.description
            binding.tvEquipment.text = ticket.equipmentName
            binding.tvDate.text = ticket.createdAt.substring(0, 10)

            // Barre de priorité (couleur)
            val priorityColor = when (ticket.priority) {
                "high" -> android.graphics.Color.parseColor("#EF4444")  // Rouge
                "medium" -> android.graphics.Color.parseColor("#F59E0B") // Orange
                else -> android.graphics.Color.parseColor("#10B981")    // Vert
            }
            binding.viewPriority.setBackgroundColor(priorityColor)

            // Texte du statut
            val statusText = when (ticket.status) {
                "open" -> "Ouvert"
                "in_progress" -> "En cours"
                "resolved" -> "Résolu"
                else -> "Fermé"
            }
            binding.tvStatus.text = statusText

            // Couleur du badge selon statut (sans fichiers drawable)
            val statusColor = when (ticket.status) {
                "open" -> android.graphics.Color.parseColor("#10B981")   // Vert
                "in_progress" -> android.graphics.Color.parseColor("#F59E0B") // Orange
                "resolved" -> android.graphics.Color.parseColor("#3B82F6")   // Bleu
                else -> android.graphics.Color.parseColor("#6B7280")    // Gris
            }
            binding.tvStatus.setBackgroundColor(statusColor)

            // Ajouter du padding et coins arrondis au badge
            binding.tvStatus.setPadding(24, 6, 24, 6)
        }





    }
}