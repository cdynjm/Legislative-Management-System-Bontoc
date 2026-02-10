<?php declare(strict_types=1);

namespace App\GraphQL\Queries\User;

use App\Models\Officials;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;
use App\Http\Controllers\AESCipher;


final readonly class ElectedOfficials
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (! $this->authorize()) {
            throw new AuthorizationException('You are not authorized to access fields');
        }

       return Officials::with((new Officials)->relation)->orderBy('name', 'ASC')->get();

    }

    private function authorize(): bool
    {
        return Auth::user()->can('accessUser');
    }
}
