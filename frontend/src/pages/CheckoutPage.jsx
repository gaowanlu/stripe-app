import { useState } from 'react'

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        try {
            setLoading(true)

            const response = await fetch('http://mfavant.xyz:3001/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ success_url: window.location.origin + '/success', cancel_url: window.location.origin + '/cancel' }),
            });

            const data = await response.json()

            if (data?.url) {
                window.open(data.url, '_self') //, '_blank'
            } else {
                alert('未找到有效链接')
            }
        } catch (error) {
            console.error('请求出错:', error)
            alert('请求失败，请检查网络或服务器状态')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '2rem' }}>
            <button onClick={handleClick} disabled={loading}>
                {loading ? '请求中...' : '发起 Checkout 请求'}
            </button>
        </div>
    )
}
