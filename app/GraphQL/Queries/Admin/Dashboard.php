<?php declare(strict_types=1);

namespace App\GraphQL\Queries\Admin;
use App\Models\Officials;
use App\Models\User;
use App\Models\Categories;
use App\Models\Files;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;
use App\Http\Controllers\AESCipher;

final readonly class Dashboard
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (! $this->authorize()) {
            throw new AuthorizationException('You are not authorized to access fields');
        }

        return [
            'adminsCount' => User::where('role', 1)->count(),
            'officialsCount' => Officials::where('status', 1)->count(),
            'categoriesCount' => Categories::count(),
            'filesCount' => Files::count(),
            'files' => Files::limit(10)->orderBy('updated_at', 'DESC')->get()
        ];
    }

    private function authorize(): bool
    {
        return Auth::user()->can('accessAdmin');
    }
}
