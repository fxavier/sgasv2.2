import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all people involved in investigation
export async function GET() {
  try {
    const people = await db.pessoasEnvolvidasNaInvestigacao.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedPeople = people.map((person) => ({
      id: person.id,
      nome: person.nome,
      empresa: person.empresa,
      actividade: person.actividade,
      assinatura: person.assinatura,
      data: person.data.toISOString(),
      created_at: person.createdAt.toISOString(),
      updated_at: person.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedPeople);
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people' },
      { status: 500 }
    );
  }
}

// POST create a new person
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { nome, empresa, actividade, assinatura, data } = body;

    if (!nome || !empresa || !actividade || !assinatura || !data) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const person = await db.pessoasEnvolvidasNaInvestigacao.create({
      data: {
        nome,
        empresa,
        actividade,
        assinatura,
        data: new Date(data),
      },
    });

    // Format the response to match frontend expectations
    const formattedPerson = {
      id: person.id,
      nome: person.nome,
      empresa: person.empresa,
      actividade: person.actividade,
      assinatura: person.assinatura,
      data: person.data.toISOString(),
      created_at: person.createdAt.toISOString(),
      updated_at: person.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedPerson, { status: 201 });
  } catch (error) {
    console.error('Error creating person:', error);
    return NextResponse.json(
      { error: 'Failed to create person' },
      { status: 500 }
    );
  }
}
