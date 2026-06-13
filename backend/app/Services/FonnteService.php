<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    /**
     * Send a WhatsApp message via Fonnte API
     */
    public static function sendMessage(string $target, string $message): bool
    {
        $token = config('services.fonnte.token') ?: env('FONNTE_TOKEN');
        
        if (!$token) {
            Log::warning('Fonnte token is not set. WhatsApp message not sent.');
            return false;
        }

        // Sanitize phone number prefix: replace leading '0' or '+62' or '62' correctly
        $target = self::sanitizePhoneNumber($target);

        try {
            $response = Http::withoutVerifying()
                ->withHeaders([
                    'Authorization' => $token,
                ])
                ->asForm()
                ->post('https://api.fonnte.com/send', [
                    'target' => $target,
                    'message' => $message,
                ]);

            if ($response->successful()) {
                Log::info("Fonnte notification sent to $target");
                return true;
            } else {
                Log::error("Fonnte API responded with error: " . $response->body());
                return false;
            }
        } catch (\Exception $e) {
            Log::error("Fonnte API request failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Converts Indonesian local numbers into international standard without '+' prefix
     * e.g., 08123456789 -> 628123456789
     */
    private static function sanitizePhoneNumber(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }
        
        return $phone;
    }
}
