import { useForm } from "react-hook-form";

const BecomeSeller = () => {
    const handleClick = async () => {
        const body = {user_id: "69111e8a06251b39d3acd8f9",
                        date: new Date().toISOString(),
                        admin_id: "69111e8a06251b39d3acd8f9"
        }
        const url = "http://localhost:3000/api/upgrade";
        try{
            const response = await fetch (url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(body)
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
        }
        catch (error){
            console.error("Failed to send POST upgrade:", error);
        }
    }
    return(
        <>
            <button className="absolute left-0 top-[-55px] bg-linear-to-r from-[#667EEA] to-[#b366ea]
             text-white font-bold px-5 py-2 rounded-2xl border-white border-2    shadow-2xl
             hover:scale-[1.1] transition-all transition-1000 ease-in-out hover:cursor-pointer"
             onClick={handleClick}>
                Trở thành người bán
            </button>
        </>
    )
}

export default BecomeSeller;