<?php declare(strict_types=1);

namespace App\GraphQL\Queries\User;

use App\Models\Officials;
use App\Models\User;
use App\Models\Categories;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;
use App\Http\Controllers\AESCipher;

final readonly class FileManager
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (! $this->authorize()) {
            throw new AuthorizationException('You are not authorized to access fields');
        }

        return [
            'categoriesList' => Categories::with((new Categories)->relation)->where('parentID', 0)->orderBy('created_at', 'DESC')->get(),
        ];
    }
    private function authorize(): bool
    {
        return Auth::user()->can('accessUser');
    }
}
