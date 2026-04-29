package com.maintenance.app.ui.tickets

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.maintenance.app.data.api.RetrofitClient
import com.maintenance.app.databinding.FragmentTicketsBinding
import com.maintenance.app.ui.adapters.TicketAdapter
import com.maintenance.app.utils.TokenManager
import kotlinx.coroutines.launch

class TicketsFragment : Fragment() {

    private var _binding: FragmentTicketsBinding? = null
    private val binding get() = _binding!!
    private lateinit var tokenManager: TokenManager
    private lateinit var ticketAdapter: TicketAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentTicketsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        tokenManager = TokenManager(requireContext())
        setupRecyclerView()
        setupClickListeners()  // ⭐ AJOUTE CETTE LIGNE
        loadTickets()
    }

    private fun setupClickListeners() {
        binding.btnAddTicket.setOnClickListener {
            val intent = Intent(requireContext(), CreateTicketActivity::class.java)
            startActivity(intent)
        }
    }

    private fun setupRecyclerView() {
        ticketAdapter = TicketAdapter { ticketId ->
            val intent = Intent(requireContext(), TicketDetailActivity::class.java)
            intent.putExtra("ticket_id", ticketId)
            startActivity(intent)
        }

        binding.rvTickets.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = ticketAdapter
        }
    }

    private fun loadTickets() {
        binding.progressBar.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.getTickets()

                if (response.isSuccessful) {
                    val tickets = response.body()
                    if (tickets.isNullOrEmpty()) {
                        Toast.makeText(requireContext(), "Aucun ticket trouvé", Toast.LENGTH_SHORT).show()
                    } else {
                        ticketAdapter.submitList(tickets)
                    }
                } else {
                    Toast.makeText(requireContext(), "Erreur ${response.code()}", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Erreur: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                binding.progressBar.visibility = View.GONE
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}