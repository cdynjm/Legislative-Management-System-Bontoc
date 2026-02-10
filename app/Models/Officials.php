<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Http\Controllers\AESCipher;

class Officials extends Model
{
    use SoftDeletes;

    protected $table = 'officials';

    public $relation = ['user'];

    protected $fillable = [
        'id',
        'name',
        'address',
        'position',
        'status',
        'photo'
        
    ];

    public function user() 
    {
        return $this->hasOne(User::class, 'officialID', 'id')->withTrashed();
    }

    public function getEncryptedIdAttribute(): string
    {
        return app(AESCipher::class)->encrypt((string) $this->attributes['id']);
    }

}
