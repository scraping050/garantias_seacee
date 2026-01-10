"""
Dashboard endpoints using RAW SQL - adapted to real database structure.
Uses licitaciones_cabecera (which has data) instead of empty licitaciones_adjudicaciones.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from typing import Optional
from decimal import Decimal

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/kpis")
def get_dashboard_kpis(
    year: Optional[int] = Query(None, description="Filter by year. 0 or None for All."),
    estado: Optional[str] = Query(None, description="Filter by estado_proceso"),
    tipo_procedimiento: Optional[str] = Query(None, description="Filter by tipo_procedimiento"),
    categoria: Optional[str] = Query(None, description="Filter by categoria"),
    departamento: Optional[str] = Query(None, description="Filter by departamento"),
    db: Session = Depends(get_db)
):
    """
    Get dashboard KPIs using data from licitaciones_cabecera.
    """
    
    try:
        # Build WHERE clause for filters
        where_clauses = []
        params = {}
        
        if year and year > 0:
            where_clauses.append("YEAR(fecha_publicacion) = :year")
            params['year'] = year
        if estado:
            where_clauses.append("estado_proceso = :estado")
            params['estado'] = estado
        if tipo_procedimiento:
            where_clauses.append("tipo_procedimiento = :tipo_proc")
            params['tipo_proc'] = tipo_procedimiento
        if categoria:
            where_clauses.append("categoria = :categoria")
            params['categoria'] = categoria
        if departamento:
            where_clauses.append("departamento = :departamento")
            params['departamento'] = departamento
        
        where_sql = "WHERE " + " AND ".join(where_clauses) if where_clauses else ""
        
        # 1. Total monto estimado y cantidad de licitaciones
        sql_kpis = text(f"""
            SELECT 
                COALESCE(SUM(monto_estimado), 0) as monto_total,
                COUNT(DISTINCT id_convocatoria) as total_licitaciones
            FROM licitaciones_cabecera
            {where_sql}
        """)
        
        result = db.execute(sql_kpis, params).fetchone()
        monto_total = float(result[0]) if result[0] else 0
        total_licitaciones = result[1] or 0
        
        # 2. Top 5 departamentos
        sql_deptos = text(f"""
            SELECT 
                departamento as nombre,
                COUNT(*) as total,
                COALESCE(SUM(monto_estimado), 0) as monto
            FROM licitaciones_cabecera
            WHERE departamento IS NOT NULL AND departamento != ''
            {("AND " + " AND ".join(where_clauses)) if where_clauses else ""}
            GROUP BY departamento
            ORDER BY total DESC
            LIMIT 5
        """)
        
        deptos = db.execute(sql_deptos, params).fetchall()
        top_departamentos = [{"nombre": row[0], "total": row[1], "monto": float(row[2]) if row[2] else 0} for row in deptos]
        
        # 3. Top 5 entidades compradoras
        sql_entidades = text(f"""
            SELECT 
                comprador as nombre,
                COUNT(*) as total,
                COALESCE(SUM(monto_estimado), 0) as monto
            FROM licitaciones_cabecera
            WHERE comprador IS NOT NULL AND comprador != ''
            {("AND " + " AND ".join(where_clauses)) if where_clauses else ""}
            GROUP BY comprador
            ORDER BY total DESC
            LIMIT 5
        """)
        
        entidades = db.execute(sql_entidades, params).fetchall()
        top_entidades = [{"nombre": row[0], "total": row[1], "monto": float(row[2]) if row[2] else 0} for row in entidades]
        
        # 4. Distribución por categoría (Bien/Obra/Servicio/Consultoría)
        sql_categorias = text(f"""
            SELECT 
                categoria as nombre,
                COUNT(*) as total,
                COALESCE(SUM(monto_estimado), 0) as monto
            FROM licitaciones_cabecera
            WHERE categoria IS NOT NULL AND categoria != ''
            {("AND " + " AND ".join(where_clauses)) if where_clauses else ""}
            GROUP BY categoria
            ORDER BY total DESC
        """)
        
        categorias = db.execute(sql_categorias, params).fetchall()
        distribucion_categorias = [{"nombre": row[0], "total": row[1], "monto": float(row[2]) if row[2] else 0} for row in categorias]
        
        # 5. Licitaciones por estado
        sql_estados = text(f"""
            SELECT 
                estado_proceso as nombre,
                COUNT(*) as total
            FROM licitaciones_cabecera
            WHERE estado_proceso IS NOT NULL AND estado_proceso != ''
            {("AND " + " AND ".join(where_clauses)) if where_clauses else ""}
            GROUP BY estado_proceso
            ORDER BY total DESC
        """)
        
        estados = db.execute(sql_estados, params).fetchall()
        distribucion_estados = [{"nombre": row[0], "total": row[1]} for row in estados]
        
        return {
            "monto_total_estimado": str(Decimal(str(monto_total))),
            "total_licitaciones": total_licitaciones,
            "top_departamentos": top_departamentos,
            "top_entidades": top_entidades,
            "distribucion_categorias": distribucion_categorias,
            "distribucion_estados": distribucion_estados
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "error": str(e),
            "monto_total_estimado": "0",
            "total_licitaciones": 0,
            "top_departamentos": [],
            "top_entidades": [],
            "distribucion_estados": []
        }


@router.get("/filter-options")
def get_filter_options(db: Session = Depends(get_db)):
    """
    Get all available filter options for dropdowns (Raw SQL version).
    """
    try:
        # Estados
        estados = db.execute(text("SELECT DISTINCT estado_proceso FROM licitaciones_cabecera WHERE estado_proceso IS NOT NULL AND estado_proceso != '' ORDER BY estado_proceso")).fetchall()
        
        # Categorias
        categorias = db.execute(text("SELECT DISTINCT categoria FROM licitaciones_cabecera WHERE categoria IS NOT NULL AND categoria != '' ORDER BY categoria")).fetchall()
        
        # Departamentos
        deptos = db.execute(text("SELECT DISTINCT departamento FROM licitaciones_cabecera WHERE departamento IS NOT NULL AND departamento != '' ORDER BY departamento")).fetchall()
        
        # Tipos Entidad
        tipos = db.execute(text("SELECT DISTINCT tipo_procedimiento FROM licitaciones_cabecera WHERE tipo_procedimiento IS NOT NULL AND tipo_procedimiento != '' ORDER BY tipo_procedimiento")).fetchall()
        
        # Aseguradoras (check if table exists or has data)
        aseguradoras_list = []
        try:
            raw_aseguradoras = db.execute(text("SELECT DISTINCT entidad_financiera FROM licitaciones_adjudicaciones WHERE entidad_financiera IS NOT NULL AND entidad_financiera != ''")).fetchall()
            
            # Normalize list
            from app.utils.normalization import normalize_insurer_name
            norm_set = set()
            for r in raw_aseguradoras:
                norm_set.add(normalize_insurer_name(r[0]))
            
            aseguradoras_list = sorted(list(norm_set))
        except:
            aseguradoras_list = []

        return {
            "estados": [r[0] for r in estados],
            "objetos": [r[0] for r in categorias],
            "departamentos": [r[0] for r in deptos],
            "tipos_entidad": [r[0] for r in tipos],
            "aseguradoras": aseguradoras_list
        }
    except Exception as e:
        print(f"Error getting filter options: {e}")
        return {
            "estados": [],
            "objetos": [],
            "departamentos": [],
            "tipos_entidad": [],
            "aseguradoras": []
        }

@router.get("/distribution-by-type")
def get_distribution_by_type(year: int = 2024, db: Session = Depends(get_db)):
    try:
        year_filter = "AND YEAR(fecha_publicacion) = :year" if year > 0 else ""
        sql = text(f"""
            SELECT 
                categoria as name,
                COUNT(*) as value,
                COALESCE(SUM(monto_estimado), 0) as amount
            FROM licitaciones_cabecera
            WHERE categoria IS NOT NULL AND categoria != ''
            {year_filter}
            GROUP BY categoria
            ORDER BY value DESC
        """)
        params = {"year": year} if year > 0 else {}
        result = db.execute(sql, params).fetchall()
        data = [{"name": row[0], "value": row[1], "amount": float(row[2])} for row in result]
        return {"data": data}
    except Exception as e:
        return {"data": [], "error": str(e)}

@router.get("/stats-by-status")
def get_stats_by_status(db: Session = Depends(get_db)):
    try:
        sql = text("""
            SELECT 
                estado_proceso as name,
                COUNT(*) as value
            FROM licitaciones_cabecera
            WHERE estado_proceso IS NOT NULL AND estado_proceso != ''
            GROUP BY estado_proceso
            ORDER BY value DESC
        """)
        result = db.execute(sql).fetchall()
        data = [{"name": row[0], "value": row[1]} for row in result]
        return {"data": data}
    except Exception as e:
        return {"data": [], "error": str(e)}

@router.get("/monthly-trend")
def get_monthly_trend(year: int = 2024, db: Session = Depends(get_db)):
    try:
        # If year > 0, filter by specific year. If 0 (All), average or sum by month across years?
        # Requirement says "All" shows total. So likely sum of all Januaries, all Februaries, etc.
        year_filter = "WHERE YEAR(fecha_publicacion) = :year" if year > 0 else ""
        
        sql = text(f"""
            SELECT 
                MONTH(fecha_publicacion) as mes,
                COUNT(*) as count,
                COALESCE(SUM(monto_estimado), 0) as amount
            FROM licitaciones_cabecera
            {year_filter}
            GROUP BY MONTH(fecha_publicacion)
            ORDER BY mes
        """)
        
        params = {"year": year} if year > 0 else {}
        result = db.execute(sql, params).fetchall()
        
        months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        data = []
        for i in range(12):
            month_idx = i + 1
            row = next((r for r in result if r[0] == month_idx), None)
            data.append({
                "name": months[i],
                "count": row[1] if row else 0,
                "value": float(row[2]) if row else 0
            })
            
        return {"data": data}
    except Exception as e:
        return {"data": [], "error": str(e)}

@router.get("/department-ranking")
def get_department_ranking(year: int = 2024, db: Session = Depends(get_db)):
    try:
        print(f"DEBUG: get_department_ranking called with year={year}")
        where_year = "AND EXTRACT(YEAR FROM fecha_publicacion) = :year" if year > 0 else ""
        print(f"DEBUG: where_year clause: {where_year}")
        
        sql = text(f"""
            SELECT 
                departamento as name,
                COUNT(*) as count,
                COALESCE(SUM(monto_estimado), 0) as amount
            FROM licitaciones_cabecera
            WHERE departamento IS NOT NULL AND departamento != ''
            {where_year}
            GROUP BY departamento
            ORDER BY count DESC
        """)
        
        params = {"year": year} if year > 0 else {}
        result = db.execute(sql, params).fetchall()
        data = [{"name": row[0], "count": row[1], "amount": float(row[2])} for row in result]
        return {"data": data}
    except Exception as e:
        return {"data": [], "error": str(e)}

@router.get("/financial-entities-ranking")
def get_financial_entities_ranking(
    year: int = 2024,
    department: Optional[str] = Query(None, description="Filter by department"),
    db: Session = Depends(get_db)
):
    try:
        # Build SQL with filters
        where_clauses = []
        params = {}
        
        if year > 0:
            where_clauses.append("EXTRACT(YEAR FROM c.fecha_publicacion) = :year")
            params["year"] = year
            
        if department:
            where_clauses.append("c.departamento = :department")
            params["department"] = department

        where_sql = " AND ".join(where_clauses) if where_clauses else "1=1"

        # Primary Query: Entidad Financiera (Insurers) from Adjudicaciones
        # Note: We rely on the fact that licitaciones_adjudicaciones has id_convocatoria matching cabecera
        sql = text(f"""
            SELECT 
                a.entidad_financiera as name,
                c.departamento,
                COUNT(*) as count,
                COALESCE(SUM(a.monto_adjudicado), 0) as amount
            FROM licitaciones_adjudicaciones a
            JOIN licitaciones_cabecera c ON a.id_convocatoria = c.id_convocatoria
            WHERE a.entidad_financiera IS NOT NULL 
              AND a.entidad_financiera != '' 
              AND a.entidad_financiera != 'SIN_GARANTIA'
              AND a.entidad_financiera != 'ERROR_API_500'
              AND {where_sql}
            GROUP BY a.entidad_financiera, c.departamento
            ORDER BY amount DESC
            LIMIT 500
        """)
        
        result = db.execute(sql, params).fetchall()
        
        # Apply Normalization to match Search Filters
        from app.utils.normalization import normalize_insurer_name

        # Aggregate counts by normalized name
        aggregated = {}
        for row in result:
            raw_name = row[0]
            dept = row[1]
            count = row[2]
            amount = float(row[3])
            
            if not raw_name: continue
            
            # Normalize
            normalized_name = normalize_insurer_name(raw_name)
            
            if normalized_name not in aggregated:
                aggregated[normalized_name] = {
                    "count": 0, 
                    "amount": 0.0, 
                    "depts": set()
                }
            
            aggregated[normalized_name]["count"] += count
            aggregated[normalized_name]["amount"] += amount
            if dept:
                aggregated[normalized_name]["depts"].add(dept)

        # Convert back to list and sort
        data = [
            {
                "name": k, 
                "count": v["count"], 
                "amount": v["amount"],
                "dept_count": len(v["depts"])
            } 
            for k, v in aggregated.items()
        ]
        data.sort(key=lambda x: x["count"], reverse=True)
        # Removed data[:10] slice to allow frontend to control view limit

        if not data:
            data = []

        return {"data": data}
    except Exception as e:
         return {"data": [], "error": str(e)}

@router.get("/province-ranking")
def get_province_ranking(
    department: str = Query(..., description="Department name"), 
    year: int = 2024,
    db: Session = Depends(get_db)
):
    try:
        where_year = "AND YEAR(fecha_publicacion) = :year" if year > 0 else ""
        
        sql = text(f"""
            SELECT 
                provincia as name,
                COUNT(*) as count,
                COALESCE(SUM(monto_estimado), 0) as amount
            FROM licitaciones_cabecera
            WHERE departamento = :department 
              AND provincia IS NOT NULL 
              AND provincia != ''
              {where_year}
            GROUP BY provincia
            ORDER BY count DESC
        """)
        
        params = {"department": department}
        if year > 0:
            params["year"] = year
            
        result = db.execute(sql, params).fetchall()
        data = [{"name": row[0], "count": row[1], "amount": float(row[2])} for row in result]
        return {"data": data}
    except Exception as e:
        return {"data": [], "error": str(e)}
