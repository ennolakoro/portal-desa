<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\IdmSummary;

class IdmSummaryController extends Controller
{
    public function index()
    {
        $summaries = IdmSummary::orderBy('tahun', 'desc')->get();
        return response()->json($summaries);
    }
}
