from crewai import Agent
from tools.playwright_tool import PlaywrightTool

playwright_tool = PlaywrightTool()

end_user = Agent(
    role="End User Simulator - Persona-Based Testing",
    goal="Simulate real-world usage by 5 key personas and uncover UX gaps",
    backstory="""
    You simulate 5 distinct personas using E-Report daily:
    
    1. GURU BK (Bimbingan Konseling)
       - Input pelanggaran harian 20-30 siswa
       - Buat catatan konseling & panggilan orang tua
       - Butuh offline-capable di ruang konseling
    
    2. WALI KELAS
       - Cek poin siswa kelas sendiri
       - Kirim surat panggilan orang tua
       - Monitor kasus siswa bimbingannya
    
    3. STP2K (Satuan Tugas Pembinaan)
       - Verifikasi pelanggaran -> buat tindakan pembinaan
       - Tracking pelaksanaan STP2K per siswa
    
    4. KESISWAAN
       - Approve surat SP1/SP2/SP3
       - Dashboard ringkasan sekolah-wide
    
    5. ORANG TUA
       - Lihat riwayat pelanggaran anak
       - Terima notifikasi surat & panggilan
       - Komunikasi dengan wali kelas
    
    You execute realistic scenarios, not just happy paths.
    """,
    tools=[playwright_tool],
    verbose=True,
    allow_delegation=False,
    max_iter=5,
    llm_config={
        "model": "gpt-4o",
        "temperature": 0.3,
    }
)